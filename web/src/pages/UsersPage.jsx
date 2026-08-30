import React, { useState, useRef, useEffect } from 'react';
import {
  UserIcon,
  ShieldIcon,
  AddIcon,
  HistoryIcon,
  SingleCheckIcon,
  CloseIcon,
  SparkleIcon,
  MoreIcon,
  DeleteIcon,
} from '../config/icons';
import Swal from 'sweetalert2';

const DEFAULT_TEAM = [
  {
    id: 'u_1',
    name: 'Presbytery Admin',
    email: 'admin@pcg.org',
    role: 'Super Admin',
    department: 'Church IT & Secretariat',
    status: 'Active',
    lastActive: 'Just now',
  },
  {
    id: 'u_2',
    name: 'Rev. Emmanuel Asamoah',
    email: 'e.asamoah@pcg.org',
    role: 'Liturgy Director',
    department: 'Committee on Liturgy & Worship',
    status: 'Active',
    lastActive: '2 hours ago',
  },
  {
    id: 'u_3',
    name: 'Dr. Grace Ofori-Atta',
    email: 'g.ofori@pcg.org',
    role: 'Language Translator (Twi)',
    department: 'Ga / Dangme / Twi Literature Dept',
    status: 'Active',
    lastActive: 'Yesterday',
  },
  {
    id: 'u_4',
    name: 'Kofi Mensah (Organist)',
    email: 'k.mensah@pcg.org',
    role: 'Music Director',
    department: 'Music & Sol-fa Committee',
    status: 'Active',
    lastActive: '3 days ago',
  },
];

const AUDIT_LOGS = [
  { action: 'Updated Hymn #142 (Easter Resurrection)', user: 'Rev. Emmanuel Asamoah', time: '10 mins ago', type: 'edit' },
  { action: 'Uploaded audio tune for Hymn #45', user: 'Kofi Mensah (Organist)', time: '1 hour ago', type: 'audio' },
  { action: 'Published Twi translation for Hymn #88', user: 'Dr. Grace Ofori-Atta', time: '3 hours ago', type: 'translate' },
  { action: 'Created new collection "Easter & Resurrection"', user: 'Presbytery Admin', time: 'Yesterday', type: 'collection' },
  { action: 'Exported full JSON Database Backup', user: 'Presbytery Admin', time: '2 days ago', type: 'backup' },
];

const UsersPage = ({ session }) => {
  const [teamMembers, setTeamMembers] = useState(DEFAULT_TEAM);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'Editor', department: '' });
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openMenuId === null) return;
      const activeRef = menuRefs.current[openMenuId];
      if (activeRef && !activeRef.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  const handleRemoveMember = (id, name) => {
    setTeamMembers(teamMembers.filter((m) => m.id !== id));
    Swal.fire('Removed', `${name} access has been revoked.`, 'info');
  };

  const handleResendInvite = (email) => {
    Swal.fire('Dispatched', `Access invite sent to ${email}`, 'success');
  };

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteForm.email.trim()) return;

    const newMember = {
      id: `u_${Date.now()}`,
      name: inviteForm.name.trim() || inviteForm.email.split('@')[0],
      email: inviteForm.email.trim(),
      role: inviteForm.role,
      department: inviteForm.department.trim() || 'General Worship Committee',
      status: 'Invited',
      lastActive: 'Pending Acceptance',
    };

    setTeamMembers([...teamMembers, newMember]);
    setIsInviteOpen(false);
    Swal.fire({
      title: 'Invitation Sent!',
      text: `An invitation has been dispatched to ${newMember.email}`,
      icon: 'success',
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Church Team & Role Permissions</h1>
          <p>Manage editors, translators, music directors, and review recent audit activity</p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" onClick={() => setIsInviteOpen(true)}>
            <AddIcon /> Invite Team Member
          </button>
        </div>
      </div>

      {/* Role Definitions Breakdown */}
      <div className="dashboard-stats-grid" style={{ marginBottom: 28 }}>
        <div className="stat-card-modern stat-card-blue">
          <div className="stat-icon-wrapper stat-icon-blue">
            <ShieldIcon />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Super Admin</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 2 }}>
              Full database access, user management, backups & publishing.
            </div>
          </div>
        </div>

        <div className="stat-card-modern stat-card-purple">
          <div className="stat-icon-wrapper stat-icon-purple">
            <SparkleIcon />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Translator (Twi)</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 2 }}>
              Edit and align Twi lyrics, titles, and linguistic diacritics (ɛ, ɔ).
            </div>
          </div>
        </div>

        <div className="stat-card-modern stat-card-gold">
          <div className="stat-icon-wrapper stat-icon-gold">
            <UserIcon />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Music Director</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 2 }}>
              Upload organ accompaniment audio and maintain tonic sol-fa.
            </div>
          </div>
        </div>
      </div>

      {/* Team Members List */}
      <div className="card-container" style={{ marginBottom: 28 }}>
        <div className="card-header-row">
          <h3>Authorized Church Administrators</h3>
          <span className="badge badge-green">{teamMembers.length} Members</span>
        </div>

        <div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
          <table className="modern-table">
            <thead>
              <tr>
                <th>Member Name</th>
                <th>Email Address</th>
                <th>Assigned Role</th>
                <th>Church Department</th>
                <th>Status</th>
                <th>Last Active</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((user) => (
                <tr key={user.id}>
                  <td style={{ fontWeight: 700, color: 'var(--pcg-blue-dark)' }}>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className="badge badge-blue">{user.role}</span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{user.department}</td>
                  <td>
                    <span className={`badge ${user.status === 'Active' ? 'badge-green' : 'badge-gold'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{user.lastActive}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div
                      className="action-menu-wrapper"
                      ref={(el) => {
                        menuRefs.current[user.id] = el;
                      }}
                    >
                      <button
                        type="button"
                        className={`ellipsis-btn ${openMenuId === user.id ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === user.id ? null : user.id);
                        }}
                        title="Actions"
                      >
                        <MoreIcon />
                      </button>

                      {openMenuId === user.id && (
                        <div className="dropdown-menu">
                          <button
                            type="button"
                            className="dropdown-item"
                            onClick={() => {
                              setOpenMenuId(null);
                              handleResendInvite(user.email);
                            }}
                          >
                            <SingleCheckIcon /> Resend Access Link
                          </button>
                          <button
                            type="button"
                            className="dropdown-item dropdown-item-danger"
                            onClick={() => {
                              setOpenMenuId(null);
                              handleRemoveMember(user.id, user.name);
                            }}
                          >
                            <DeleteIcon /> Revoke Access
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log / Activity Timeline */}
      <div className="card-container">
        <div className="card-header-row">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <HistoryIcon /> Recent Modification Audit Trail
          </h3>
          <span className="badge badge-gray">Real-time Tracker</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {AUDIT_LOGS.map((log, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="sync-dot" />
                <span style={{ fontWeight: 600, fontSize: 13.5 }}>{log.action}</span>
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
                by <strong>{log.user}</strong> • {log.time}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteOpen && (
        <div className="drawer-overlay" onClick={() => setIsInviteOpen(false)}>
          <div className="drawer-container" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Invite Church Team Member</h2>
              <button className="page-btn" onClick={() => setIsInviteOpen(false)} style={{ border: 'none' }}>
                <CloseIcon size={18} />
              </button>
            </div>

            <form onSubmit={handleInvite} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div className="drawer-body">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={inviteForm.name}
                    onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                    placeholder="e.g. Rev. Kwaku Boateng"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    className="form-input"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    placeholder="e.g. k.boateng@pcg.org"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Role</label>
                  <select
                    className="form-select"
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Liturgy Director">Liturgy Director</option>
                    <option value="Language Translator (Twi)">Language Translator (Twi)</option>
                    <option value="Music Director">Music Director</option>
                    <option value="Reviewer / Viewer">Reviewer / Viewer</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Department / Committee</label>
                  <input
                    type="text"
                    className="form-input"
                    value={inviteForm.department}
                    onChange={(e) => setInviteForm({ ...inviteForm, department: e.target.value })}
                    placeholder="e.g. Worship & Music Committee"
                  />
                </div>
              </div>

              <div className="drawer-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsInviteOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <SingleCheckIcon /> Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
