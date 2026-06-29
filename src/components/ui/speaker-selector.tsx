"use client";

import { Check, ChevronsUpDown, Volume2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { AudioDevice } from "@/components/ui/mic-selector";

const REQUEST_TIMEOUT_MS = 8000;

export function supportsAudioOutputSelection(): boolean {
  return (
    typeof HTMLAudioElement !== "undefined" &&
    "setSinkId" in HTMLAudioElement.prototype
  );
}

export interface SpeakerSelectorProps {
  value?: string;
  onValueChange?: (deviceId: string) => void;
  disabled?: boolean;
  className?: string;
}

function cleanLabel(rawLabel: string, deviceId: string) {
  const fallback = deviceId
    ? `Speaker ${deviceId.slice(0, 8)}`
    : "System default";
  const label = rawLabel || fallback;
  return label.replace(/\s*\([^)]*\)/g, "").trim();
}

function mapAudioOutputs(list: MediaDeviceInfo[]): AudioDevice[] {
  return list
    .filter((device) => device.kind === "audiooutput" && device.deviceId)
    .map((device) => ({
      deviceId: device.deviceId,
      label: cleanLabel(device.label, device.deviceId),
      groupId: device.groupId,
    }));
}

export function useAudioOutputDevices() {
  const [devices, setDevices] = useState<AudioDevice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [canEnumerate, setCanEnumerate] = useState(false);
  const inFlightRef = useRef(false);

  const enumerate = useCallback(async () => {
    const list = await navigator.mediaDevices.enumerateDevices();
    setDevices(mapAudioOutputs(list));
  }, []);

  const requestPermission = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setLoading(true);
    setError(null);

    const streamPromise = navigator.mediaDevices.getUserMedia({ audio: true });

    const applyStream = (stream: MediaStream) => {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setHasPermission(true);
      setError(null);
      void enumerate();
    };

    const reportError = (err: unknown) => {
      const name = err instanceof Error ? err.name : "";
      setError(
        name === "NotAllowedError" || name === "SecurityError"
          ? "Microphone access blocked. Allow it to list speakers with names."
          : "Could not access audio devices.",
      );
    };

    try {
      const outcome = await Promise.race([
        streamPromise.then((stream) => ({ stream })),
        new Promise<{ timedOut: true }>((resolve) => {
          window.setTimeout(
            () => resolve({ timedOut: true }),
            REQUEST_TIMEOUT_MS,
          );
        }),
      ]);

      if ("timedOut" in outcome) {
        void streamPromise.then(applyStream).catch(reportError);
        setError(
          "Still waiting for microphone permission. Check your browser prompt, then try again.",
        );
      } else {
        applyStream(outcome.stream);
      }
    } catch (err) {
      reportError(err);
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  }, [enumerate]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices) {
      setError("This browser does not support speaker selection.");
      return;
    }
    setCanEnumerate(true);

    let cancelled = false;

    const init = async () => {
      try {
        if (navigator.permissions?.query) {
          const permissionStatus = await navigator.permissions.query({
            name: "microphone" as PermissionName,
          });

          if (permissionStatus.state === "granted") {
            await enumerate();
            if (!cancelled) setHasPermission(true);
          }

          permissionStatus.onchange = () => {
            if (permissionStatus.state === "granted") {
              void enumerate();
              setHasPermission(true);
            } else if (permissionStatus.state === "denied") {
              setHasPermission(false);
            }
          };
        }
      } catch {
        // Fall back to requesting on dropdown open.
      }
    };

    void init();

    return () => {
      cancelled = true;
    };
  }, [enumerate]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices) return;

    const handleDeviceChange = () => {
      if (hasPermission) {
        void enumerate();
      }
    };

    navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);
    return () => {
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        handleDeviceChange,
      );
    };
  }, [hasPermission, enumerate]);

  return {
    devices,
    loading,
    error,
    hasPermission,
    canEnumerate,
    requestPermission,
  };
}

export function SpeakerSelector({
  value,
  onValueChange,
  disabled,
  className,
}: SpeakerSelectorProps) {
  const {
    devices,
    loading,
    error,
    hasPermission,
    requestPermission,
    canEnumerate,
  } = useAudioOutputDevices();

  const [selectedDevice, setSelectedDevice] = useState<string>(value || "");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedDevice(value);
    }
  }, [value]);

  const defaultDeviceId = devices[0]?.deviceId || "";
  const selectedStillExists = devices.some(
    (d) => d.deviceId === selectedDevice,
  );

  useEffect(() => {
    if ((!selectedDevice || !selectedStillExists) && defaultDeviceId) {
      setSelectedDevice(defaultDeviceId);
      onValueChange?.(defaultDeviceId);
    }
  }, [defaultDeviceId, selectedDevice, selectedStillExists, onValueChange]);

  const currentDevice = devices.find((d) => d.deviceId === selectedDevice) ||
    devices[0] || {
      label: loading
        ? "Loading..."
        : hasPermission
          ? "System default"
          : "Enable audio",
      deviceId: "",
    };

  const handleDeviceSelect = (deviceId: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    setSelectedDevice(deviceId);
    onValueChange?.(deviceId);
  };

  const handleDropdownOpenChange = (open: boolean) => {
    setIsDropdownOpen(open);
    if (open && !hasPermission && !loading) {
      void requestPermission();
    }
  };

  if (!supportsAudioOutputSelection()) {
    return null;
  }

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={handleDropdownOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "flex h-8 min-w-0 shrink cursor-pointer items-center gap-1.5 px-2 sm:max-w-48",
            className,
          )}
          disabled={disabled || !canEnumerate}
        >
          <Volume2 className="size-4 shrink-0" />
          <span className="hidden min-w-0 flex-1 truncate text-left text-xs sm:inline">
            {currentDevice.label}
          </span>
          <ChevronsUpDown className="size-3 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="w-72">
        {loading ? (
          <DropdownMenuItem disabled>Loading speakers...</DropdownMenuItem>
        ) : error ? (
          <>
            <DropdownMenuItem disabled className="text-destructive">
              {error}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                void requestPermission();
              }}
            >
              Try again
            </DropdownMenuItem>
          </>
        ) : !hasPermission ? (
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              void requestPermission();
            }}
          >
            <Volume2 className="size-4" />
            Enable audio access to list speakers
          </DropdownMenuItem>
        ) : devices.length === 0 ? (
          <DropdownMenuItem disabled>No speakers found</DropdownMenuItem>
        ) : (
          devices.map((device) => (
            <DropdownMenuItem
              key={device.deviceId}
              onClick={(e) => handleDeviceSelect(device.deviceId, e)}
              onSelect={(e) => e.preventDefault()}
              className="flex items-center justify-between"
            >
              <span className="truncate">{device.label}</span>
              {selectedDevice === device.deviceId && (
                <Check className="size-4 shrink-0" />
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
