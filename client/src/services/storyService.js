import API from "./axios";

export const getStories = () => API.get("/stories");
export const createStory = (data) => API.post("/stories", data);
export const getStoryById = (id) => API.get(`/stories/${id}`);
export const deleteStory = (id) => API.delete(`/stories/${id}`);
export const getMyStories = () =>API.get("/stories/my")