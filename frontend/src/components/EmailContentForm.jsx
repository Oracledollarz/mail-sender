import React, { useState, useEffect } from "react";
import { useField } from "formik";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  DocumentTextIcon,
  CodeBracketIcon,
  EnvelopeIcon,
  TagIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { getAllTemplates, getTemplateById, saveTemplateToLocalStorage } from "../lib/templates/emailTemplates";

const EmailContentForm = () => {
  const [fromField, fromMeta] = useField('emailData.from');
  const [subjectField, subjectMeta, subjectHelpers] = useField('emailData.subject');
  const [htmlField, htmlMeta, htmlHelpers] = useField('emailData.html');
  const [useHtmlMode, setUseHtmlMode] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [templates, setTemplates] = useState([]);

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  useEffect(() => {
    setTemplates(getAllTemplates());
  }, []);

  const handleTemplateSelect = (templateId) => {
    if (templateId === "") return;
    const template = getTemplateById(templateId);
    if (template) {
      subjectHelpers.setValue(template.subject);
      htmlHelpers.setValue(template.html);
      setSelectedTemplate(templateId);
    }
  };

  const handleSaveTemplate = () => {
    const templateName = prompt("Enter a name for this template:");
    if (templateName && templateName.trim()) {
      const newTemplate = {
        id: `custom_${Date.now()}`,
        name: templateName.trim(),
        subject: subjectField.value,
        html: htmlField.value,
      };
      if (saveTemplateToLocalStorage(newTemplate)) {
        setTemplates(getAllTemplates());
        alert("Template saved successfully!");
      } else {
        alert("Error saving template");
      }
    }
  };

  const previewHtml = htmlField.value.replace(/\{(\w+)\}/g, (match, varName) => {
    return `<span style="background-color: #ffeb3b; padding: 2px 4px; border-radius: 3px;">{${varName}}</span>`;
  });

  return (
    <div className="bg-white border-2 border-black rounded-2xl p-8 animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-black border-2 border-black rounded-lg">
          <DocumentTextIcon className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-black">Email Content</h2>
      </div>

      <div className="space-y-5">
        {/* From Email */}
        <div>
          <label
            className="block text-sm font-semibold text-black mb-2"
            htmlFor="email-from"
          >
            From Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <EnvelopeIcon className="h-5 w-5 text-black" />
            </div>
            <input
              id="email-from"
              type="email"
              className="w-full pl-10 pr-4 py-3 border-2 border-black rounded-xl focus:border-black transition-all duration-200 outline-none"
              placeholder="sender@example.com"
              {...fromField}
            />
          </div>
          {fromMeta.touched && fromMeta.error && (
            <p className="mt-1 text-sm text-red-600">{fromMeta.error}</p>
          )}
        </div>

        {/* Template Selector */}
        <div>
          <label className="block text-sm font-semibold text-black mb-2">
            Email Template
          </label>
          <div className="flex gap-2">
            <select
              value={selectedTemplate}
              onChange={(e) => handleTemplateSelect(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-black rounded-xl focus:border-black transition-all duration-200 outline-none bg-white"
            >
              <option value="">Select a template...</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleSaveTemplate}
              className="px-4 py-3 border-2 border-black rounded-xl hover:bg-gray-100 transition-all duration-200 flex items-center gap-2"
              title="Save current email as template"
            >
              <DocumentDuplicateIcon className="w-5 h-5" />
              Save Template
            </button>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-3 border-2 border-black rounded-xl hover:bg-gray-100 transition-all duration-200 flex items-center gap-2"
              title="Preview email"
            >
              <EyeIcon className="w-5 h-5" />
              Preview
            </button>
          </div>
        </div>

        {/* Subject */}
        <div>
          <label
            className="block text-sm font-semibold text-black mb-2"
            htmlFor="email-subject"
          >
            Subject <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <TagIcon className="h-5 w-5 text-black" />
            </div>
            <input
              id="email-subject"
              type="text"
              className="w-full pl-10 pr-4 py-3 border-2 border-black rounded-xl focus:border-black transition-all duration-200 outline-none"
              placeholder="Email Subject"
              {...subjectField}
            />
          </div>
          {subjectMeta.touched && subjectMeta.error && (
            <p className="mt-1 text-sm text-red-600">{subjectMeta.error}</p>
          )}
        </div>

        {/* HTML Mode Toggle */}
        <div className="flex items-center p-4 bg-white rounded-xl border-2 border-black">
          <input
            id="html-mode"
            type="checkbox"
            checked={useHtmlMode}
            onChange={(e) => setUseHtmlMode(e.target.checked)}
            className="w-5 h-5 text-black border-2 border-black rounded focus:ring-black focus:ring-2"
          />
          <label
            htmlFor="html-mode"
            className="ml-3 flex items-center gap-2 text-sm font-medium text-black cursor-pointer"
          >
            <CodeBracketIcon className="w-5 h-5 text-black" />
            Use HTML Code Editor
          </label>
        </div>

        {/* Email Body */}
        <div>
          <label className="block text-sm font-semibold text-black mb-2">
            Email Body <span className="text-red-500">*</span>
            <span className="block text-xs font-normal text-black mt-1">
              Use template variables like {"{name}"}, {"{email}"} for personalization
            </span>
          </label>
          {useHtmlMode ? (
            <textarea
              className="w-full px-4 py-3 border-2 border-black rounded-xl focus:border-black transition-all duration-200 outline-none font-mono text-sm"
              rows="15"
              placeholder="Enter HTML code here..."
              value={htmlField.value}
              onChange={(e) => htmlHelpers.setValue(e.target.value)}
              onBlur={htmlField.onBlur}
            />
          ) : (
            <div className="quill-editor">
              <ReactQuill
                theme="snow"
                value={htmlField.value}
                onChange={(value) => htmlHelpers.setValue(value)}
                modules={quillModules}
                className="bg-white rounded-xl"
              />
            </div>
          )}
          {htmlMeta.touched && htmlMeta.error && (
            <p className="mt-1 text-sm text-red-600">{htmlMeta.error}</p>
          )}
        </div>

        {/* Email Preview */}
        {showPreview && (
          <div className="border-2 border-black rounded-xl p-4 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-black">Email Preview</h3>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <XMarkIcon className="w-5 h-5 text-black" />
              </button>
            </div>
            <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50 max-h-96 overflow-auto">
              <div
                dangerouslySetInnerHTML={{ __html: previewHtml }}
                style={{ maxWidth: "600px", margin: "0 auto" }}
              />
            </div>
            <p className="mt-2 text-xs text-black">
              Template variables are highlighted in yellow. They will be replaced with actual values when sending.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailContentForm;

