"use client";

import { useEffect, useState, useCallback } from "react";
import AuthGuard from "@/components/AuthGuard";
import useAuthStore from "@/store/authStore";
import useTrackerStore from "@/store/trackerStore";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileStats from "@/components/profile/ProfileStats";
import TopGenres from "@/components/profile/TopGenres";
import ProfileFavorites from "@/components/profile/ProfileFavorites";
import RecentStatus from "@/components/profile/RecentStatus";
import RecentActivity from "@/components/profile/RecentActivity";
import ProfileMediaList from "@/components/profile/ProfileMediaList";
import ProfileReviews from "@/components/profile/ProfileReviews";
import ProfileHistory from "@/components/profile/ProfileHistory";
import EditProfileModal from "@/components/profile/EditProfileModal";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const trackerItems = useTrackerStore((s) => s.items);
  const fetchTrackerList = useTrackerStore((s) => s.fetchTrackerList);

  const [activeTab, setActiveTab] = useState("overview");
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Fetch tracker data saat halaman profil dimuat
  useEffect(() => {
    fetchTrackerList();
  }, [fetchTrackerList]);

  const handleEditProfile = useCallback(() => {
    setEditModalOpen(true);
  }, []);

  return (
    <AuthGuard>
      <div className="min-h-[calc(100vh-3.5rem)] bg-bg pb-28 md:pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-20 sm:pt-22 md:pt-24">
          {/* Header: Banner + Avatar + Info */}
          <ProfileHeader user={user} onEditProfile={handleEditProfile} />

          {/* Tabs */}
          <ProfileTabs activeTab={activeTab} onChangeTab={setActiveTab} />

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === "overview" && (
              <div className="space-y-5">
                {/* Statistik Ringkasan */}
                <ProfileStats trackerItems={trackerItems} />

                {/* Grid: Top Genres + Favorites */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <TopGenres trackerItems={trackerItems} />
                  <ProfileFavorites />
                </div>

                {/* Grid: Recent Status + Recent Activity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <RecentStatus trackerItems={trackerItems} />
                  <RecentActivity trackerItems={trackerItems} />
                </div>
              </div>
            )}

            {activeTab === "anime" && (
              <ProfileMediaList
                trackerItems={trackerItems}
                mediaType="anime"
              />
            )}

            {activeTab === "manga" && (
              <ProfileMediaList
                trackerItems={trackerItems}
                mediaType="manga"
              />
            )}

            {activeTab === "reviews" && <ProfileReviews />}

            {activeTab === "history" && (
              <ProfileHistory trackerItems={trackerItems} />
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        user={user}
      />
    </AuthGuard>
  );
}
