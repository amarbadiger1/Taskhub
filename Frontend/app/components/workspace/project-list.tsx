import React from "react";
import type { Project } from "~/types";
import { NoDataFound } from "../no-data-found";
import { ProjectCard } from "../project/project-card";
import { motion } from "framer-motion";

interface ProjectListProps {
    workspaceId: string;
    projects: Project[];
    onCreateProject: () => void;
}

export const ProjectList = ({
    workspaceId,
    projects,
    onCreateProject,
}: ProjectListProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {/* Title */}
            <motion.h3
                className="text-xl font-medium mb-4 text-blue-500"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                Projects
            </motion.h3>

            {/* Project Grid */}
            <motion.div
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: {},
                    visible: {
                        transition: { staggerChildren: 0.1 },
                    },
                }}
            >
                {projects.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <NoDataFound
                            title="No projects found"
                            description="Create a project to get started"
                            buttonText="Create Project"
                            buttonAction={onCreateProject}
                        />
                    </motion.div>
                ) : (
                    projects.map((project, index) => {
                        const completedTasks =
                            project.tasks?.filter((task: any) => task.status === "Done")
                                .length ?? 0;
                        const totalTasks = project.tasks?.length ?? 0;
                        const projectProgress =
                            totalTasks > 0
                                ? Math.round((completedTasks / totalTasks) * 100)
                                : 0;

                        return (
                            <motion.div
                                key={project._id}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index, duration: 0.6 }}
                            >
                                <ProjectCard
                                    project={project}
                                    progress={projectProgress}
                                    workspaceId={workspaceId}
                                />
                            </motion.div>
                        );
                    })
                )}
            </motion.div>
        </motion.div>
    );
};
