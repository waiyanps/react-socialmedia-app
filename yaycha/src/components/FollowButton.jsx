import { useMutation } from "@tanstack/react-query";
import { useApp, queryClient } from "../ThemedApp";
import { postFollow, deleteFollow } from "../libs/fetcher";
import { Button } from "@mui/material";

export default function FollowButton({ user }) {
    const { auth } = useApp();
    if (!auth) return <></>;

    const isFollowing = () => {
        return user.following.find(item => item.followerId == auth.id);
    };

    const follow = useMutation({
        mutationFn: async (id) => postFollow(id),
        onSuccess: async () => {
            await queryClient.refetchQueries({ queryKey: ["users"] });
            await queryClient.refetchQueries({ queryKey: ["user"] });
            await queryClient.refetchQueries({ queryKey: ["search"] });
        },
        onError: (error) => {
            console.error("Error following user:");
        },
    });

    const unfollow = useMutation({
        mutationFn: async (id) => deleteFollow(id),
        onSuccess: async () => {
            await queryClient.refetchQueries({ queryKey: ["users"] });
            await queryClient.refetchQueries({ queryKey: ["user"] });
            await queryClient.refetchQueries({ queryKey: ["search"] });
        },
        onError: (error) => {
            console.error("Error unfollowing user:", error);
        },
    });

    return auth.id === user.id ? (
        <></>
    ) : (
        <Button 
            size="small"
            edge="end"
            variant={isFollowing() ? "outlined" : "contained"}
            sx={{ borderRadius: 5 }}
            onClick={(e) => {
                if (isFollowing()) {
                    unfollow.mutate(user.id);
                } else {
                    follow.mutate(user.id);
                }

                e.stopPropagation();
            }}
        >
            {isFollowing() ? "Following" : "Follow"} 
        </Button>
    );
} 