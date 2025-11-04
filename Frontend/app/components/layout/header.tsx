import { useAuth } from "~/provider/auth-context";
import type { Workspace } from "~/types";
import { Button } from "../ui/button";
import { Bell, PlusCircle } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
    DropdownMenuGroup,
} from "../ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Link, useLoaderData, useLocation, useNavigate } from "react-router";
import { WorkspaceAvatar } from "../workspace/WorkspaceAvatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Badge } from "../ui/badge";

interface HeaderProps {
    onWorkspaceSelected: (workspace: Workspace) => void;
    selectedWorkspace: Workspace | null;
    onCreateWorkspace: () => void;
}

type HeaderLoaderData = {
    workspaces: Workspace[];
};

export const Header = ({
    onWorkspaceSelected,
    selectedWorkspace,
    onCreateWorkspace,
}: HeaderProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const { workspaces } = useLoaderData() as HeaderLoaderData;

    const isOnWorkspacePage = location.pathname.includes("/workspaces");

    const handleOnClick = (workspace: Workspace) => {
        onWorkspaceSelected(workspace);
        if (isOnWorkspacePage) {
            navigate(`/workspaces/${workspace._id}`);
        } else {
            navigate(`${location.pathname}?workspaceId=${workspace._id}`);
        }
    };

    return (
        <div className="bg-background sticky top-0 z-40 border-b">
            <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
                {/* Workspace Selector */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            {selectedWorkspace ? (
                                <>
                                    {selectedWorkspace.color && (
                                        <WorkspaceAvatar
                                            color={selectedWorkspace.color}
                                            name={selectedWorkspace.name}
                                        />
                                    )}
                                    <span className="ml-2 font-medium">
                                        {selectedWorkspace.name}
                                    </span>
                                </>
                            ) : (
                                <span className="font-medium">Select Workspace</span>
                            )}
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                        <DropdownMenuLabel>Workspace</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuGroup>
                            {workspaces?.length ? (
                                workspaces.map((ws) => (
                                    <DropdownMenuItem key={ws._id} onClick={() => handleOnClick(ws)}>
                                        {ws.color && (
                                            <WorkspaceAvatar color={ws.color} name={ws.name} />
                                        )}
                                        <span className="ml-2">{ws.name}</span>
                                    </DropdownMenuItem>
                                ))
                            ) : (
                                <DropdownMenuItem disabled>No workspaces found</DropdownMenuItem>
                            )}
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={onCreateWorkspace}>
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Create Workspace
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Notification and Profile */}
                <div className="flex items-center gap-2">
                    {/* Notification Dropdown */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="w-5 h-5 text-muted-foreground" />
                                {/* Red dot */}
                                {/* <Badge className="absolute top-1 right-1 w-2 h-2 p-0 bg-red-500 rounded-full"></Badge> */}
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent align="end" className="w-72 shadow-lg p-0">
                            <div className="p-4 border-b">
                                <h3 className="text-sm font-semibold">Notifications</h3>
                            </div>

                            <div className="max-h-60 overflow-y-auto">

                            </div>

                            <div className="border-t text-center text-xs py-2 text-muted-foreground hover:text-primary cursor-pointer transition">
                                View all
                            </div>
                        </PopoverContent>
                    </Popover>

                    {/* Profile Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="rounded-full border p-1 w-8 h-8">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={user?.profilePicture} alt={user?.name} />
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link to="/user/profile">Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={logout}>Log Out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
};
