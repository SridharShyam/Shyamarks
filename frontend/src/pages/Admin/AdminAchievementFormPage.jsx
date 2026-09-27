import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Upload, Save, Check, AlertCircle, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { api } from '../../services/api';

const ACHIEVEMENT_TYPES = [
  'Certification',
  'Internship',
  'Virtual Experience',
  'Workshop',
  'Course',
  'Competition',
  'Award',
  'Project',
  'Publication',
  'Hackathon',
  'Training',
  'Other',
];

export const AdminAchievementFormPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Certification');
  const [description, setDescription] = useState('');
  const [issuerId, setIssuerId] = useState('');
  const [issuedDate, setIssuedDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [selectedSkillIds, setSelectedSkillIds] = useState([]);
  const [selectedProjectIds, setSelectedProjectIds] = useState([]);
  const [selectedExperienceIds, setSelectedExperienceIds] = useState([]);
  const [credentialId, setCredentialId] = useState('');
  const [verificationUrl, setVerificationUrl] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileType, setFileType] = useState('');
  const [fileSize, setFileSize] = useState(undefined);
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [featured, setFeatured] = useState(false);
  const [slug, setSlug] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  // Story / Narrative states
  const [isStoryExpanded, setIsStoryExpanded] = useState(false);
  const [narrativeContext, setNarrativeContext] = useState('');
  const [narrativeChallenge, setNarrativeChallenge] = useState('');
  const [narrativeOutcome, setNarrativeOutcome] = useState('');

  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState('');

  // Auxiliary data queries
  const { data: issuers } = useQuery({
    queryKey: ['issuers-form'],
    queryFn: () => api.getIssuers(),
  });

  const { data: skills } = useQuery({
    queryKey: ['skills-form'],
    queryFn: () => api.getSkills(),
  });

  const { data: projects } = useQuery({
    queryKey: ['projects-form'],
    queryFn: () => api.getProjects(),
  });

  const { data: experiences } = useQuery({
    queryKey: ['experiences-form'],
    queryFn: () => api.getExperiences(),
  });

  // Fetch existing achievement if in edit mode
  const { data: existingAchievement } = useQuery({
    queryKey: ['achievement-edit', id],
    queryFn: () => api.getAchievementById(id),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (existingAchievement) {
      setTitle(existingAchievement.title || '');
      setType(existingAchievement.type || 'Certification');
      setDescription(existingAchievement.description || '');
      setIssuerId(existingAchievement.issuer_id || '');
      setIssuedDate(existingAchievement.issued_date || '');
      setExpiryDate(existingAchievement.expiry_date || '');
      setSelectedSkillIds(existingAchievement.skill_ids || []);
      setSelectedProjectIds(existingAchievement.project_ids || []);
      setSelectedExperienceIds(existingAchievement.experience_ids || []);
      setCredentialId(existingAchievement.credential_id || '');
      setVerificationUrl(existingAchievement.verification_url || '');
      setCredentialUrl(existingAchievement.credential_url || '');
      setFileUrl(existingAchievement.file_url || '');
      setFileType(existingAchievement.file_type || '');
      setFileSize(existingAchievement.file_size);
      setPreviewImageUrl(existingAchievement.preview_image_url || '');
      setVisibility(existingAchievement.visibility || 'public');
      setFeatured(existingAchievement.featured || false);
      setSlug(existingAchievement.slug || '');
      setTagsInput(existingAchievement.tags ? existingAchievement.tags.join(', ') : '');
      setNarrativeContext(existingAchievement.narrative_context || '');
      setNarrativeChallenge(existingAchievement.narrative_challenge || '');
      setNarrativeOutcome(existingAchievement.narrative_outcome || '');
      if (existingAchievement.narrative_context || existingAchievement.narrative_challenge || existingAchievement.narrative_outcome) {
        setIsStoryExpanded(true);
      }
    }
  }, [existingAchievement]);

  const saveMutation = useMutation({
    mutationFn: (data) =>
      isEditMode ? api.updateAchievement(id, data) : api.createAchievement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-achievements-list'] });
      queryClient.invalidateQueries({ queryKey: ['admin-achievements-all'] });
      navigate('/admin/achievements');
    },
    onError: (err) => {
      setFormError(err.message || 'Failed to save achievement');
    },
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setFormError('');
    try {
      const res = await api.uploadFile(file);
      setFileUrl(res.file_url);
      setFileType(res.file_type);
      setFileSize(res.file_size);
      if (res.preview_url) {
        setPreviewImageUrl(res.preview_url);
      }
    } catch (err) {
      setFormError(err.message || 'File upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim() || !issuedDate.trim() || !description.trim()) {
      setFormError('Title, Issued Date, and Description are required.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title,
      type,
      description,
      issuer_id: issuerId || undefined,
      issued_date: issuedDate,
      expiry_date: expiryDate || undefined,
      skill_ids: selectedSkillIds,
      project_ids: selectedProjectIds,
      experience_ids: selectedExperienceIds,
      credential_id: credentialId || undefined,
      verification_url: verificationUrl || undefined,
      credential_url: credentialUrl || undefined,
      file_url: fileUrl || undefined,
      file_type: fileType || undefined,
      file_size: fileSize,
      preview_image_url: previewImageUrl || undefined,
      visibility,
      featured,
      slug: slug || undefined,
      tags,
      narrative_context: narrativeContext || undefined,
      narrative_challenge: narrativeChallenge || undefined,
      narrative_outcome: narrativeOutcome || undefined,
    };

    saveMutation.mutate(payload);
  };

  const toggleSelection = (list, setList, idVal) => {
    if (list.includes(idVal)) {
      setList(list.filter((x) => x !== idVal));
    } else {
      setList([...list, idVal]);
    }
  };

  const inputStyles = "w-full bg-surface-elevated border border-border text-text-primary placeholder:text-text-muted text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-accent transition-colors";
  const labelStyles = "text-xs font-semibold text-text-primary block mb-1";

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/achievements"
          className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Achievements List</span>
        </Link>
        <h1 className="text-xl font-bold text-text-primary">
          {isEditMode ? 'Edit Achievement' : 'Create New Achievement'}
        </h1>
      </div>

      {formError && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl p-4 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-md">
        {/* Title & Type */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-1.5">
            <label className={labelStyles}>Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AWS Certified Solutions Architect"
              className={inputStyles}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelStyles}>Type *</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={inputStyles}
            >
              {ACHIEVEMENT_TYPES.map((t) => (
                <option key={t} value={t} className="bg-surface-elevated text-text-primary">{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Issuer & Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className={labelStyles}>Issuer</label>
            <select
              value={issuerId}
              onChange={(e) => setIssuerId(e.target.value)}
              className={inputStyles}
            >
              <option value="" className="bg-surface-elevated text-text-primary">No Issuer Selected</option>
              {issuers?.map((issuer) => (
                <option key={issuer.id} value={issuer.id} className="bg-surface-elevated text-text-primary">{issuer.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className={labelStyles}>Issued Date (YYYY-MM-DD) *</label>
            <input
              type="date"
              required
              value={issuedDate}
              onChange={(e) => setIssuedDate(e.target.value)}
              className={inputStyles}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelStyles}>Expiry Date (Optional)</label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className={inputStyles}
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className={labelStyles}>Description & Evidence Scope *</label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what was accomplished, topics covered, or project details..."
            className={`${inputStyles} p-4`}
          />
        </div>

        {/* Credentials & URLs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className={labelStyles}>Credential ID</label>
            <input
              type="text"
              value={credentialId}
              onChange={(e) => setCredentialId(e.target.value)}
              placeholder="e.g. AWS-12345678"
              className={`${inputStyles} font-mono`}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelStyles}>Verification URL</label>
            <input
              type="url"
              value={verificationUrl}
              onChange={(e) => setVerificationUrl(e.target.value)}
              placeholder="https://credly.com/verify/..."
              className={inputStyles}
            />
          </div>
        </div>

        {/* Collapsible Add Story / Narrative Panel */}
        <div className="border border-border rounded-xl overflow-hidden bg-surface-elevated/50">
          <button
            type="button"
            onClick={() => setIsStoryExpanded(!isStoryExpanded)}
            className="w-full px-5 py-3.5 flex items-center justify-between text-left text-xs font-semibold text-accent hover:text-accent/80 hover:bg-surface-elevated transition-colors"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-accent" />
              <span>Add Narrative / Story Behind This (Optional)</span>
            </div>
            {isStoryExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {isStoryExpanded && (
            <div className="p-5 space-y-4 border-t border-border bg-surface-elevated/80">
              {/* Context */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <label className={labelStyles}>Context</label>
                  <span className="text-[10px] font-mono text-text-muted">
                    {2000 - narrativeContext.length} chars remaining
                  </span>
                </div>
                <textarea
                  rows={3}
                  maxLength={2000}
                  value={narrativeContext}
                  onChange={(e) => setNarrativeContext(e.target.value)}
                  placeholder="What was happening at this point in your journey?"
                  className={`${inputStyles} p-3`}
                />
              </div>

              {/* Challenge */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <label className={labelStyles}>Challenge</label>
                  <span className="text-[10px] font-mono text-text-muted">
                    {2000 - narrativeChallenge.length} chars remaining
                  </span>
                </div>
                <textarea
                  rows={3}
                  maxLength={2000}
                  value={narrativeChallenge}
                  onChange={(e) => setNarrativeChallenge(e.target.value)}
                  placeholder="What made this achievement difficult or meaningful?"
                  className={`${inputStyles} p-3`}
                />
              </div>

              {/* Outcome */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <label className={labelStyles}>Outcome</label>
                  <span className="text-[10px] font-mono text-text-muted">
                    {2000 - narrativeOutcome.length} chars remaining
                  </span>
                </div>
                <textarea
                  rows={3}
                  maxLength={2000}
                  value={narrativeOutcome}
                  onChange={(e) => setNarrativeOutcome(e.target.value)}
                  placeholder="What changed after this — skill, direction, or mindset?"
                  className={`${inputStyles} p-3`}
                />
              </div>
            </div>
          )}
        </div>

        {/* File Upload Section */}
        <div className="space-y-2 border-t border-b border-border py-4">
          <label className={labelStyles}>
            Evidence File Upload (PDF, PNG, JPG, WEBP - Max 10MB)
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-surface-elevated hover:bg-surface border border-border text-text-primary text-xs font-semibold flex items-center gap-2 transition-colors">
              <Upload className="w-4 h-4 text-accent" />
              <span>{uploading ? 'Uploading...' : 'Choose File to Upload'}</span>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>

            {fileUrl && (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 truncate max-w-sm">
                <Check className="w-4 h-4" />
                <span>Uploaded: {fileUrl}</span>
              </span>
            )}
          </div>
        </div>

        {/* Multi-select for Linked Skills */}
        <div className="space-y-2">
          <label className={labelStyles}>Link Associated Skills</label>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-3 bg-surface-elevated rounded-xl border border-border">
            {skills?.map((s) => {
              const selected = selectedSkillIds.includes(s.id);
              return (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => toggleSelection(selectedSkillIds, setSelectedSkillIds, s.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    selected
                      ? 'bg-accent text-white border-accent'
                      : 'bg-surface text-text-secondary border-border hover:text-text-primary'
                  }`}
                >
                  {s.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Visibility, Featured, Custom Slug & Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="space-y-1.5">
            <label className={labelStyles}>Visibility</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className={inputStyles}
            >
              <option value="public" className="bg-surface-elevated text-text-primary">Public (Listed & Direct URL)</option>
              <option value="unlisted" className="bg-surface-elevated text-text-primary">Unlisted (Direct URL Only)</option>
              <option value="private" className="bg-surface-elevated text-text-primary">Private (Admin Only)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className={labelStyles}>Tags (comma separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="aws, cloud, devops"
              className={inputStyles}
            />
          </div>

          <div className="flex items-center pt-6">
            <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-text-primary select-none">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded bg-surface-elevated border-border text-accent focus:ring-accent"
              />
              <span>★ Highlight as Featured</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-border flex items-center justify-end gap-3">
          <Link
            to="/admin/achievements"
            className="px-5 py-2.5 rounded-xl bg-surface-elevated hover:bg-surface text-text-secondary font-semibold text-xs transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="px-6 py-2.5 rounded-xl bg-accent hover:brightness-110 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-accent-glow disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saveMutation.isPending ? 'Saving Record...' : isEditMode ? 'Update Achievement' : 'Create Achievement'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
