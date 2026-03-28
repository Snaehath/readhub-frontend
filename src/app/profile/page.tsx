import { Metadata } from "next";
import ProfileView from "@/components/profile/profile-view";

export const metadata: Metadata = {
  title: "Your Profile",
  description:
    "Manage your digital reading preferences, settings, and credentials.",
};

const ProfilePage = () => {
  return <ProfileView />;
};

export default ProfilePage;
