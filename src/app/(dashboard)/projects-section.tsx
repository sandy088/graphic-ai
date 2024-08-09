"use client";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import {
  CopyIcon,
  FileIcon,
  Loader,
  MoreHorizontal,
  Search,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const ProjectsSection = () => {
  const router = useRouter();
  const { data, status, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useGetProjects();

  if (status === "pending") {
    return (
      <div className=" space-y-4">
        <h3 className="font-semibold text-lg">Recent Projects</h3>
        <div className=" flex flex-col gap-y-4 items-center justify-center h-32">
          <Loader className=" size-6 text-muted-foreground animate-spin" />
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className=" space-y-4">
        <h3 className="font-semibold text-lg">Recent Projects</h3>
        <div className=" flex flex-col gap-y-4 items-center justify-center h-32">
          <Search className=" size-6 text-muted-foreground" />
          <p className=" text-muted-foreground text-sm">
            Unable to fetch projects.
          </p>
        </div>
      </div>
    );
  }

  if (!data?.pages?.length) {
    return (
      <div className=" space-y-4">
        <h3 className="font-semibold text-lg">Recent Projects</h3>
        <div className=" flex flex-col gap-y-4 items-center justify-center h-32">
          <Search className=" size-6 text-muted-foreground" />
          <p className=" text-muted-foreground text-sm">
            You haven&apos;t created any projects yet.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className=" space-y-4">
      <h3 className="font-semibold text-lg">Recent Projects</h3>
      <Table>
        <TableBody>
          {data.pages.map((group, index) => (
            <React.Fragment key={index}>
              {group.data.map((project) => (
                <TableRow key={project.id}>
                  <TableCell
                    onClick={() => router.push(`/editor/${project.id}`)}
                    className="font-medium flex items-center gap-x-2 cursor-pointer"
                  >
                    <FileIcon className=" size-6 text-muted-foreground" />
                    {project.name}
                  </TableCell>

                  <TableCell
                    onClick={() => router.push(`/editor/${project.id}`)}
                    className="hidden md:table-cell text-muted-foreground cursor-pointer"
                  >
                    {project.width} x {project.height}px
                  </TableCell>

                  <TableCell
                    onClick={() => router.push(`/editor/${project.id}`)}
                    className="hidden md:table-cell text-muted-foreground cursor-pointer"
                  >
                    {formatDistanceToNow(new Date(project.updatedAt), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  {/* for Drop down menu */}
                  <TableCell className=" flex items-center justify-end">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size={"icon"}
                          disabled={false}
                          variant={"ghost"}
                        >
                          <MoreHorizontal className=" size-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className=" w-60">
                        <DropdownMenuItem
                          disabled={false}
                          onClick={() => {}}
                          className=" h-10 cursor-pointer"
                        >
                          <CopyIcon className="size-4 mr-2" />
                          Make a copy
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={false}
                          onClick={() => {}}
                          className=" h-10 cursor-pointer"
                        >
                          <Trash className="size-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      {hasNextPage && (
        <div className="w-full flex items-center justify-center pt-4">
          <Button onClick={() => fetchNextPage()} variant={"ghost"}>
            Load more
          </Button>
        </div>
      )}
    </div>
  );
};
