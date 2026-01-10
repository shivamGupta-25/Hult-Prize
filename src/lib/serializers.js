/**
 * Serializes a Blog document to a plain JSON object.
 * Handles ObjectId and Date conversion.
 * @param {Object} blog - The blog document (mongoose object or plain object)
 * @returns {Object|null} Serialized blog object
 */
export function serializeBlog(blog) {
  if (!blog) return null;

  // Ensure we have a plain object if it's a Mongoose document
  const b = blog.toObject ? blog.toObject() : blog;

  return {
    ...b,
    _id: b._id?.toString(),
    createdAt: b.createdAt?.toISOString(),
    updatedAt: b.updatedAt?.toISOString(),
    publishedAt: b.publishedAt?.toISOString(),
    likes: b.likes?.map(id => id.toString()) || [],
    dislikes: b.dislikes?.map(id => id.toString()) || [],
    // Computed fields defaults
    views: b.views || 0,
    likeCount: b.likes?.length || 0,
    commentCount: b.commentCount || 0
  };
}

/**
 * Serializes a Comment document to a plain JSON object.
 * @param {Object} comment - The comment document
 * @returns {Object|null} Serialized comment object
 */
export function serializeComment(comment) {
  if (!comment) return null;

  const c = comment.toObject ? comment.toObject() : comment;

  return {
    ...c,
    _id: c._id?.toString(),
    blogId: c.blogId?.toString(),
    createdAt: c.createdAt?.toISOString(),
    updatedAt: c.updatedAt?.toISOString(),
  };
}
