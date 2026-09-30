import { useAuth } from "../context/AuthContext";
import {
  User,
  Mail,
  ShieldCheck,
  ShieldAlert,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [copied, setCopied] = useState(false);

  const displayName =
    currentUser?.displayName ||
    currentUser?.email?.split("@")[0] ||
    "SchemeAid User";

  const copyUserId = async () => {
    if (!currentUser?.uid) return;

    try {
      await navigator.clipboard.writeText(currentUser.uid);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="page-container profile-page">

      {/* Profile Header */}
      <div className="profile-card">

        <div className="profile-header">

          <div className="profile-avatar">
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <User className="w-8 h-8" />
            )}
          </div>

          <div>
            <h1 className="profile-name">
              {displayName}
            </h1>

            <p className="profile-subtitle">
              SchemeAid user
            </p>
          </div>

        </div>

        <div className="profile-section">

          <h2 className="profile-section-title">
            Account Information
          </h2>

          {/* Email */}
          <div className="profile-row">

            <div className="profile-row-left">

              <div className="profile-row-icon">
                <Mail className="w-4 h-4" />
              </div>

              <div>
                <p className="profile-label">
                  Email
                </p>

                <p className="profile-value">
                  {currentUser?.email || "Not available"}
                </p>
              </div>

            </div>

          </div>

          {/* Display Name */}
          <div className="profile-row">

            <div className="profile-row-left">

              <div className="profile-row-icon">
                <User className="w-4 h-4" />
              </div>

              <div>
                <p className="profile-label">
                  Display Name
                </p>

                <p className="profile-value">
                  {currentUser?.displayName || "Not set"}
                </p>
              </div>

            </div>

          </div>

          {/* Account Verification */}
          <div className="profile-row">

            <div className="profile-row-left">

              <div className="profile-row-icon">
                {currentUser?.emailVerified ? (
                  <ShieldCheck className="w-4 h-4" />
                ) : (
                  <ShieldAlert className="w-4 h-4" />
                )}
              </div>

              <div>

                <p className="profile-label">
                  Account Verified
                </p>

                <p
                  className={
                    currentUser?.emailVerified
                      ? "profile-status verified"
                      : "profile-status not-verified"
                  }
                >
                  {currentUser?.emailVerified
                    ? "Verified"
                    : "Not verified"}
                </p>

              </div>

            </div>

          </div>

          {/* User ID */}
          <div className="profile-row">

            <div className="profile-row-left">

              <div className="profile-row-icon">
                <ShieldCheck className="w-4 h-4" />
              </div>

              <div className="min-w-0">

                <p className="profile-label">
                  User ID
                </p>

                <p className="profile-user-id">
                  {currentUser?.uid || "Not available"}
                </p>

              </div>

            </div>

            {currentUser?.uid && (
              <button
                type="button"
                onClick={copyUserId}
                className="profile-copy-button"
                title="Copy User ID"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            )}

          </div>

        </div>
      </div>

      {/* Security Information */}
      <div className="profile-info-card">

        <div className="profile-info-icon">
          <ShieldCheck className="w-5 h-5" />
        </div>

        <div>
          <h3 className="profile-info-title">
            Your information is secure
          </h3>

          <p className="profile-info-text">
            Your SchemeAid account information is securely
            managed through Firebase Authentication.
          </p>
        </div>

      </div>

    </div>
  );
};

export default ProfilePage;