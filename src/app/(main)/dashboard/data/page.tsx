import { Suspense } from "react";
import Link from "next/link";
import { Calendar } from "lucide-react";
import {
  getPeople,
  createPerson,
  deletePerson,
  duplicatePerson,
} from "@/server/actions/data";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CardGrid, CardGridSkeleton, CreateCard } from "@/components/ui/card-grid";
import { CardContextMenu } from "@/components/ui/card-context-menu";
import { Skeleton } from "@/components/ui/skeleton";

function PeopleGridSkeleton() {
  return (
    <CardGridSkeleton>
      <div className="flex flex-1 flex-col items-center justify-center gap-3">
        <Skeleton className="size-14 rounded-xl" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3.5 w-1/3" />
      </div>
    </CardGridSkeleton>
  );
}

function PersonAvatar({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <Avatar className="size-14 rounded-xl after:rounded-xl">
      <AvatarFallback className="rounded-xl text-lg font-semibold">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

async function PeopleGrid() {
  const allPeople = await getPeople();

  return (
    <CardGrid>
      <Dialog>
        <DialogTrigger asChild>
          <CreateCard label="Add Person" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Person</DialogTitle>
          </DialogHeader>
          <form action={createPerson} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="firstName" className="text-sm font-medium">
                First Name
              </label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="John"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="lastName" className="text-sm font-medium">
                Last Name
              </label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Doe"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="jobTitle" className="text-sm font-medium">
                Job Title
              </label>
              <Input
                id="jobTitle"
                name="jobTitle"
                placeholder="VP of Engineering"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="function" className="text-sm font-medium">
                Function
              </label>
              <Input
                id="function"
                name="function"
                placeholder="Engineering"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="level" className="text-sm font-medium">
                Level
              </label>
              <Input
                id="level"
                name="level"
                placeholder="Senior"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="company" className="text-sm font-medium">
                Company
              </label>
              <Input
                id="company"
                name="company"
                placeholder="Acme Corp"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="industry" className="text-sm font-medium">
                Industry
              </label>
              <Input
                id="industry"
                name="industry"
                placeholder="Technology"
              />
            </div>
            <DialogFooter>
              <Button type="submit">Add Person</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {allPeople.map((person) => (
        <CardContextMenu
          key={person.id}
          onDuplicate={duplicatePerson.bind(null, person.id)}
          onDelete={deletePerson.bind(null, person.id)}
        >
          <Link
            href={`/dashboard/data/${person.id}`}
            className="block"
          >
            <div className="flex aspect-square flex-col items-center justify-center gap-3 rounded-xl p-5 ring-1 ring-foreground/10 transition-colors hover:bg-muted/50">
              <PersonAvatar
                firstName={person.firstName}
                lastName={person.lastName}
              />
              <div className="flex flex-col items-center gap-1">
                <h3 className="text-sm font-semibold text-foreground">
                  {person.firstName} {person.lastName}
                </h3>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="size-3.5" />
                  <span className="text-xs">
                    {person.createdAt.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </CardContextMenu>
      ))}
    </CardGrid>
  );
}

export default function DataPage() {
  return (
    <div className="container mx-auto flex flex-1 flex-col overflow-y-auto px-6 py-6">
      <Suspense fallback={<PeopleGridSkeleton />}>
        <PeopleGrid />
      </Suspense>
    </div>
  );
}
