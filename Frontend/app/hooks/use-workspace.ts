import { useMutation } from "@tanstack/react-query";
import type { WorkspaceForm } from "~/components/workspace/createWorkspace";
import { postData } from "~/lib/fetch-util";

export const useCreateWorkspace = () => {
    return useMutation({
        mutationFn: async (data: WorkspaceForm) => postData("/workspaces", data),
    });
}; 