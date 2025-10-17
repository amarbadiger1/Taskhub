import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { workspaceSchema } from "~/lib/schema";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { cn } from "~/lib/utils";
import { useCreateWorkspace } from "~/hooks/use-workspace";
import { toast } from "sonner";
import { useNavigate } from "react-router";

// 8 predefined colors
export const colorOptions = [
    "#FF5733", // Red-Orange
    "#33C1FF", // Blue
    "#28A745", // Green
    "#FFC300", // Yellow
    "#8E44AD", // Purple
    "#E67E22", // Orange
    "#2ECC71", // Light Green
    "#34495E", // Navy
];

interface CreateWorkspaceProps {
    isCreatingWorkspace: boolean;
    setIsCreatingWorkspace: (isCreatingWorkspace: boolean) => void;
}


export type WorkspaceForm = z.infer<typeof workspaceSchema>;

export const CreateWorkspace = ({
    isCreatingWorkspace,
    setIsCreatingWorkspace,
}: CreateWorkspaceProps) => {
    const form = useForm<WorkspaceForm>({
        resolver: zodResolver(workspaceSchema),
        defaultValues: {
            name: "",
            color: colorOptions[0],
            description: "",
        },
    });

    const navigate = useNavigate();
    const { mutate, isPending } = useCreateWorkspace();

    const onSubmit = (data: WorkspaceForm) => {
        mutate(data, {
            onSuccess: (data: any) => {
                const { workspace } = data; // <- get the workspace object
                form.reset();
                setIsCreatingWorkspace(false);
                toast.success("Workspace Created Successfully");
                console.log(workspace._id);
                navigate(`/workspaces/${workspace._id}`);
            },
            onError: (error: any) => {
                const errorMessage =
                    error?.response?.data?.message || "Something went wrong. Please try again.";
                toast.error(errorMessage);
                console.error(error);
            }
        });
    };


    return (
        <Dialog open={isCreatingWorkspace} onOpenChange={setIsCreatingWorkspace} modal={true}>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Workspace</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="space-y-4 py-4">
                            {/* Workspace Name */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Workspace Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter workspace name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            {/* Description */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Enter description" {...field} rows={3} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Color Picker */}
                            <FormField
                                control={form.control}
                                name="color"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Workspace Color</FormLabel>
                                        <FormControl>
                                            <div className="flex gap-3 flex-wrap">
                                                {colorOptions.map((color) => (
                                                    <div
                                                        key={color}
                                                        onClick={() => field.onChange(color)}
                                                        className={cn("w-8 h-8 rounded-full cursor-pointer border-2 transition", field.value === color
                                                            ? "border-black scale-110"
                                                            : "border-gray-300"
                                                        )}
                                                        style={{ backgroundColor: color }}
                                                    />
                                                ))}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Creating..." : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
