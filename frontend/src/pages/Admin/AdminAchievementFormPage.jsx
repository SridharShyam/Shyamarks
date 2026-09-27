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

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/achievements"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Achievements List</span>
        </Link>
        <h1 className="text-xl font-bold text-white">
          {isEditMode ? 'Edit Achievement' : 'Create New Achievement'}
        </h1>
      </div>

      {formError && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl p-4 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-surface-800/80 border border-surface-700/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-md">
        {/* Title & Type */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AWS Certified Solutions Architect"
              className="w-full bg-surface-900 border border-surface-700 text-slate-100 placeholder-slate-500 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Type *</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-surface-900 border border-surface-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-500"
            >
              {ACHIEVEMENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Issuer & Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Issuer</label>
            <select
              value={issuerId}
              onChange={(e) => setIssuerId(e.target.value)}
              className="w-full bg-surface-900 border border-surface-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-500"
            >
              <option value="">No Issuer Selected</option>
              {issuers?.map((issuer) => (
                <option key={issuer.id} value={issuer.id}>{issuer.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Issued Date (YYYY-MM-DD) *</label>
            <input
              type="date"
              required
              value={issuedDate}
              onChange={(e) => setIssuedDate(e.target.value)}
              className="w-full bg-surface-900 border border-surface-700 text-slate-100 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Expiry Date (Optional)</label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full bg-surface-900 border border-surface-700 text-slate-100 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Description & Evidence Scope *</label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what was accomplished, topics covered, or project details..."
            className="w-full bg-surface-900 border border-surface-700 text-slate-100 placeholder-slate-500 text-xs rounded-xl p-4 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Credentials & URLs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Credential ID</label>
            <input
              type="text"
              value={credentialId}
              onChange={(e) => setCredentialId(e.target.value)}
              placeholder="e.g. AWS-12345678"
              className="w-full bg-surface-900 border border-surface-700 text-slate-100 placeholder-slate-500 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-brand-500 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Verification URL</label>
            <input
              type="url"
              value={verificationUrl}
              onChange={(e) => setVerificationUrl(e.target.value)}
              placeholder="https://credly.com/verify/..."
              className="w-full bg-surface-900 border border-surface-700 text-slate-100 placeholder-slate-500 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Collapsible Add Story / Narrative Panel */}
        <div className="border border-surface-700/70 rounded-xl overflow-hidden bg-surface-900/40">
          <button
            type="button"
            onClick={() => setIsStoryExpanded(!isStoryExpanded)}
            className="w-full px-5 py-3.5 flex items-center justify-between text-left text-xs font-semibold text-brand-300 hover:text-white hover:bg-surface-800/60 transition-colors"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-400" />
              <span>Add Narrative / Story Behind This (Optional)</span>
            </div>
            {isStoryExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {isStoryExpanded && (
            <div className="p-5 space-y-4 border-t border-surface-700/60 bg-surface-900/80">
              {/* Context */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold text-slate-300">Context</label>
                  <span className="text-[10px] font-mono text-slate-500">
                    {2000 - narrativeContext.length} chars remaining
                  </span>
                </div>
                <textarea
                  rows={3}
                  maxLength={2000}
                  value={narrativeContext}
                  onChange={(e) => setNarrativeContext(e.target.value)}
                  placeholder="What was happening at this point in your journey?"
                  className="w-full bg-surface-950 border border-surface-700 text-slate-100 placeholder-slate-500 text-xs rounded-xl p-3 focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* Challenge */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold text-slate-300">Challenge</label>
                  <span className="text-[10px] font-mono text-slate-500">
                    {2000 - narrativeChallenge.length} chars remaining
                  </span>
                </div>
                <textarea
                  rows={3}
                  maxLength={2000}
                  value={narrativeChallenge}
                  onChange={(e) => setNarrativeChallenge(e.target.value)}
                  placeholder="What made this achievement difficult or meaningful?"
                  className="w-full bg-surface-950 border border-surface-700 text-slate-100 placeholder-slate-500 text-xs rounded-xl p-3 focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* Outcome */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold text-slate-300">Outcome</label>
                  <span className="text-[10px] font-mono text-slate-500">
                    {2000 - narrativeOutcome.length} chars remaining
                  </span>
                </div>
                <textarea
                  rows={3}
                  maxLength={2000}
                  value={narrativeOutcome}
                  onChange={(e) => setNarrativeOutcome(e.target.value)}
                  placeholder="What changed after this — skill, direction, or mindset?"
                  className="w-full bg-surface-950 border border-surface-700 text-slate-100 placeholder-slate-500 text-xs rounded-xl p-3 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* File Upload Section */}
        <div className="space-y-2 border-t border-b border-surface-700/60 py-4">
          <label className="text-xs font-semibold text-slate-300 block">
            Evidence File Upload (PDF, PNG, JPG, WEBP - Max 10MB)
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-surface-900 hover:bg-surface-700 border border-surface-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors">
              <Upload className="w-4 h-4 text-brand-400" />
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
          <label className="text-xs font-semibold text-slate-300 block">Link Associated Skills</label>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-3 bg-surface-900 rounded-xl border border-surface-700">
            {skills?.map((s) => {
              const selected = selectedSkillIds.includes(s.id);
              return (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => toggleSelection(selectedSkillIds, setSelectedSkillIds, s.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    selected
                      ? 'bg-brand-600 text-white border-brand-500'
                      : 'bg-surface-800 text-slate-400 border-surface-700 hover:text-slate-200'
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
            <label className="text-xs font-semibold text-slate-300">Visibility</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="w-full bg-surface-900 border border-surface-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-500"
            >
              <option value="public">Public (Listed & Direct URL)</option>
              <option value="unlisted">Unlisted (Direct URL Only)</option>
              <option value="private">Private (Admin Only)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Tags (comma separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="aws, cloud, devops"
              className="w-full bg-surface-900 border border-surface-700 text-slate-100 placeholder-slate-500 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex items-center pt-6">
            <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-slate-200 select-none">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded bg-surface-900 border-surface-700 text-brand-500 focus:ring-brand-500"
              />
              <span>★ Highlight as Featured</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-surface-700/80 flex items-center justify-end gap-3">
          <Link
            to="/admin/achievements"
            className="px-5 py-2.5 rounded-xl bg-surface-900 hover:bg-surface-700 text-slate-300 font-semibold text-xs transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-brand-600/30 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saveMutation.isPending ? 'Saving Record...' : isEditMode ? 'Update Achievement' : 'Create Achievement'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
