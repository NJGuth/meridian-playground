"use client";

import { Check, ChevronsUpDown, Mic, MicOff } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LiveWaveform } from "@/components/ui/live-waveform";
import { cn } from "@/lib/utils";

const REQUEST_TIMEOUT_MS = 8000;

export interface AudioDevice {
  deviceId: string;
  label: string;
  groupId: string;
}

export interface MicSelectorProps {
  value?: string;
  onValueChange?: (deviceId: string) => void;
  muted?: boolean;
  onMutedChange?: (muted: boolean) => void;
  disabled?: boolean;
  className?: string;
  /** Request microphone permission as soon as the component mounts. */
  requestOnMount?: boolean;
}

function cleanLabel(rawLabel: string, deviceId: string) {
  const fallback = deviceId
    ? `Microphone ${deviceId.slice(0, 8)}`
    : "Microphone";
  const label = rawLabel || fallback;
  return label.replace(/\s*\([^)]*\)/g, "").trim();
}

function mapAudioInputs(list: MediaDeviceInfo[]): AudioDevice[] {
  return list
    .filter((device) => device.kind === "audioinput" && device.deviceId)
    .map((device) => ({
      deviceId: device.deviceId,
      label: cleanLabel(device.label, device.deviceId),
      groupId: device.groupId,
    }));
}

export function MicSelector({
  value,
  onValueChange,
  muted,
  onMutedChange,
  disabled,
  className,
  requestOnMount = false,
}: MicSelectorProps) {
  const {
    devices,
    loading,
    error,
    hasPermission,
    requestPermission,
    canEnumerate,
  } = useAudioDevices();

  useEffect(() => {
    if (requestOnMount) {
      void requestPermission();
    }
  }, [requestOnMount, requestPermission]);
  const [selectedDevice, setSelectedDevice] = useState<string>(value || "");
  const [internalMuted, setInternalMuted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isMuted = muted !== undefined ? muted : internalMuted;

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
          ? "No microphone"
          : "Enable microphone",
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

  const toggleMute = () => {
    const newMuted = !isMuted;
    if (muted === undefined) {
      setInternalMuted(newMuted);
    }
    onMutedChange?.(newMuted);
  };

  const isPreviewActive = isDropdownOpen && !isMuted && hasPermission;

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
          {isMuted ? (
            <MicOff className="size-4 shrink-0" />
          ) : (
            <Mic className="size-4 shrink-0" />
          )}
          <span className="hidden min-w-0 flex-1 truncate text-left text-xs sm:inline">
            {currentDevice.label}
          </span>
          <ChevronsUpDown className="size-3 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="w-72">
        {loading ? (
          <DropdownMenuItem disabled>Requesting microphone...</DropdownMenuItem>
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
            <Mic className="size-4" />
            Enable microphone access
          </DropdownMenuItem>
        ) : devices.length === 0 ? (
          <DropdownMenuItem disabled>No microphones found</DropdownMenuItem>
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
        {hasPermission && devices.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="flex items-center gap-2 p-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  toggleMute();
                }}
                className="h-8 gap-2"
              >
                {isMuted ? (
                  <MicOff className="size-4" />
                ) : (
                  <Mic className="size-4" />
                )}
                <span className="text-sm">{isMuted ? "Unmute" : "Mute"}</span>
              </Button>
              <div className="ml-auto w-16 overflow-hidden rounded-md bg-accent p-1.5">
                <LiveWaveform
                  active={isPreviewActive}
                  deviceId={selectedDevice || defaultDeviceId}
                  mode="static"
                  height={15}
                  barWidth={3}
                  barGap={1}
                />
              </div>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function useAudioDevices() {
  const [devices, setDevices] = useState<AudioDevice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [canEnumerate, setCanEnumerate] = useState(false);
  const inFlightRef = useRef(false);

  const enumerate = useCallback(async () => {
    const list = await navigator.mediaDevices.enumerateDevices();
    setDevices(mapAudioInputs(list));
  }, []);

  const requestPermission = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setLoading(true);
    setError(null);

    // Some browsers (notably Arc) can leave getUserMedia pending forever when
    // the permission prompt never surfaces. We race it against a timeout so the
    // UI is never stuck, while still honoring a late grant if it resolves after.
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
          ? "Microphone access blocked. Allow it in your browser settings."
          : "Could not access microphone.",
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
        // Release the UI so the user can retry, but keep listening for a late
        // grant (or a late denial) from the still-pending prompt.
        void streamPromise.then(applyStream).catch(reportError);
        setError(
          "Still waiting for microphone permission. Check your browser's prompt or site settings, then try again.",
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
      setError("This browser does not support microphone selection.");
      return;
    }
    setCanEnumerate(true);

    let cancelled = false;
    let permissionStatus: PermissionStatus | null = null;

    const syncGranted = async () => {
      try {
        await enumerate();
        if (!cancelled) {
          setHasPermission(true);
        }
      } catch {
        // ignore — handled on explicit request
      }
    };

    const init = async () => {
      try {
        if (navigator.permissions?.query) {
          permissionStatus = await navigator.permissions.query({
            name: "microphone" as PermissionName,
          });

          if (permissionStatus.state === "granted") {
            await syncGranted();
          }

          permissionStatus.onchange = () => {
            if (permissionStatus?.state === "granted") {
              void syncGranted();
            } else if (permissionStatus?.state === "denied") {
              setHasPermission(false);
            }
          };
        }
      } catch {
        // Permissions API not available for "microphone"; fall back to
        // requesting on demand via requestPermission().
      }
    };

    void init();

    return () => {
      cancelled = true;
      if (permissionStatus) {
        permissionStatus.onchange = null;
      }
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
