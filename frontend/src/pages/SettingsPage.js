import React, { useEffect, useState } from "react";
import api from "../api";

function SettingsPage() {
  const [profile, setProfile] = useState(null);
  const [weeklyBudget, setWeeklyBudget] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/users/me")
      .then((res) => {
        setProfile(res.data);
        setWeeklyBudget(res.data.weeklyBudget || "");
      })
      .catch(() => setStatus("Unable to load profile settings."))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus("");

    api.put("/users/me/budget", { weeklyBudget: Number(weeklyBudget || 0) })
      .then((res) => {
        setProfile(res.data);
        setWeeklyBudget(res.data.weeklyBudget || "");
        setStatus("Budget updated successfully.");
      })
      .catch((error) => setStatus(error.response?.data?.message || "Could not update budget."))
      .finally(() => setSaving(false));
  };

  if (loading) {
    return <div className="skeleton" style={{ height: 220 }} />;
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <p className="eyebrow">Workspace settings</p>
          <h1>Account controls</h1>
        </div>
      </div>

      <div className="settings-grid">
        <section className="glass settings-card">
          <h2>Profile</h2>
          <div className="profile-line"><span>Name</span><strong>{profile?.firstName} {profile?.lastName}</strong></div>
          <div className="profile-line"><span>Username</span><strong>{profile?.username}</strong></div>
          <div className="profile-line"><span>Email</span><strong>{profile?.email}</strong></div>
          <div className="profile-line"><span>Status</span><strong>{profile?.isEmailVerified ? "Verified" : "Pending verification"}</strong></div>
        </section>

        <section className="glass settings-card">
          <h2>Budget guardrail</h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.6, marginTop: 0 }}>
            Set the weekly target used by the dashboard to show spend health and remaining runway.
          </p>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <label className="field-label">Weekly budget (Rs.)</label>
            <input
              className="input-field"
              type="number"
              min="0"
              step="0.01"
              value={weeklyBudget}
              onChange={(event) => setWeeklyBudget(event.target.value)}
              placeholder="0.00"
            />
            <button className="btn-primary" type="submit" disabled={saving} style={{ opacity: saving ? 0.7 : 1 }}>
              {saving ? "Saving..." : "Save budget"}
            </button>
          </form>
          {status && <p className="form-status">{status}</p>}
        </section>
      </div>
    </div>
  );
}

export default SettingsPage;
