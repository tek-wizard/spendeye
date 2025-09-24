import { useQuery } from "@tanstack/react-query";
import { fetchContactsAPI } from "../api/userService";

export const useContacts = (options = {}) => {
  return useQuery({
    queryKey: ["contacts"],
    queryFn: fetchContactsAPI,
    select: (data) => data.map((contact) => ({ ...contact, id: contact._id })),
    ...options,
  });
};