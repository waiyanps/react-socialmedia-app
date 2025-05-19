import { IconButton, ButtonGroup, Button } from "@mui/material";

import {
    Favorite as LikedIcon,
    FavoriteBorder as LikeIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { useApp, queryClient } from "../ThemedApp";

import { useMutation } from "@tanstack/react-query";

import {
    postPostLike,
    deletePostLike,
    postCommentLike,
    deleteCommentLike,
} from "../libs/fetcher";

export default function LikeButton({ item, comment }) {
    const navigate = useNavigate();
    const { auth } = useApp();

    function isLiked() {
        if (!auth || !item?.likes) return false;

        return item.likes.find(like => like.userId == auth.id);
    }

    const likePost = useMutation({
        mutationFn: postPostLike,
        onSuccess: () => {
            queryClient.refetchQueries({ queryKey: ["posts"] });
            queryClient.refetchQueries({ queryKey: ["comments"] });
        },
    });

    const likeComment = useMutation({
        mutationFn: postCommentLike,
        onSuccess: () => {
            queryClient.refetchQueries({ queryKey: ["comments"] });
        },
    });

    const unlikePost = useMutation({
        mutationFn: deletePostLike,
        onSuccess: () => {
            queryClient.refetchQueries({ queryKey: ["posts"] });
            queryClient.refetchQueries({ queryKey: ["comments"] });
        },

    });

    const unlikeComment = useMutation({
        mutationFn: deleteCommentLike,
        onSuccess: () => {
            queryClient.refetchQueries({ queryKey: ["comments"] });
        },
    });

    const handleLikeToggle = (e) => {
        e.stopPropagation();

        if (!auth) {
            navigate("/login");
            return;
        }

        e.stopPropagation();
        const id = item?.id;
        const liked = isLiked();

        if (comment) {
            liked ? unlikeComment.mutate(id) : likeComment.mutate(id);
        } else {
            liked ? unlikePost.mutate(id) : likePost.mutate(id);
        }
    };

    const handleViewLikes = (e) => {
        e.stopPropagation();
        navigate(`/likes/${item.id}/${comment ? "comment" : "post"}`);
    
    };

    return (
        <ButtonGroup>
            <IconButton
                size="small"
                onClick={handleLikeToggle}
                disabled={
                    likePost.isPending || unlikePost.isPending ||
                    likeComment.isPending || unlikeComment.isPending
                }
            >
                {isLiked() ? (
                    <LikedIcon fontSize="small" color="error" />
                ) : (
                    <LikeIcon fontSize="small" color="error" />
                )}
            </IconButton>
            <Button
                onClick={handleViewLikes}
                sx={{ color: "text.fade" }}
                variant="text"
                size="small"
                >
                    {item.likes?.length ?? 0}
            </Button>
        </ButtonGroup>
    );
}
    