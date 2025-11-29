import React, { useState, useRef } from "react";
import { useField } from "formik";
import {
  UserGroupIcon,
  DocumentArrowUpIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

const RecipientsForm = ({ onExcelUpload }) => {
  const [recipientsField, recipientsMeta, recipientsHelpers] = useField('recipients');
  const [recipientsDataField, , recipientsDataHelpers] = useField('recipientsData');
  const [recipientType, setRecipientType] = useState('text'); // text, file
  const [availableVariables, setAvailableVariables] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const result = await onExcelUpload(file, null, 'email', true);
        if (result && result.recipients) {
          // Store full recipient data
          recipientsDataHelpers.setValue(result.recipients);
          // Also set emails for display
          recipientsHelpers.setValue(result.emails.join(', '));
          setRecipientType('text');
          // Store available variables
          if (result.availableVariables) {
            setAvailableVariables(result.availableVariables);
          }
        } else if (result && result.emails) {
          // Fallback for legacy response
          recipientsHelpers.setValue(result.emails.join(', '));
          recipientsDataHelpers.setValue(null);
          setRecipientType('text');
          setAvailableVariables([]);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Error uploading file: " + (error.message || "Unknown error"));
      }
    }
  };

  return (
    <div className="bg-white border-2 border-black rounded-2xl p-8 animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-black border-2 border-black rounded-lg">
          <UserGroupIcon className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-black">Recipients</h2>
      </div>

      <div className="space-y-5">
        {/* Recipient Source Toggle */}
        <div>
          <label className="block text-sm font-semibold text-black mb-3">
            Recipient Source
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRecipientType("text")}
              className={`px-4 py-3 rounded-xl font-semibold transition-all duration-200 border-2 ${
                recipientType === "text"
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-black hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <EnvelopeIcon className="w-5 h-5" />
                Text/Comma-separated
              </div>
            </button>
            <button
              type="button"
              onClick={() => {
                setRecipientType("file");
                if (fileInputRef.current) fileInputRef.current.click();
              }}
              className={`px-4 py-3 rounded-xl font-semibold transition-all duration-200 border-2 ${
                recipientType === "file"
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-black hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <DocumentArrowUpIcon className="w-5 h-5" />
                Upload Excel File
              </div>
            </button>
          </div>
        </div>

        {recipientType === "text" ? (
          <div>
            <label
              className="block text-sm font-semibold text-black mb-2"
              htmlFor="recipients"
            >
              Email Addresses <span className="text-red-500">*</span>
            </label>
            <textarea
              id="recipients"
              className="w-full px-4 py-3 border-2 border-black rounded-xl focus:border-black transition-all duration-200 outline-none resize-none"
              rows="6"
              placeholder="email1@example.com, email2@example.com, email3@example.com"
              {...recipientsField}
            />
            <p className="mt-2 text-xs text-black">
              Enter email addresses separated by commas
            </p>
            {recipientsMeta.touched && recipientsMeta.error && (
              <p className="mt-1 text-sm text-red-600">{recipientsMeta.error}</p>
            )}
          </div>
        ) : (
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Excel File
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="border-2 border-dashed border-black rounded-xl p-8 text-center hover:border-black hover:bg-gray-50 transition-all duration-200 cursor-pointer">
              <DocumentArrowUpIcon className="w-12 h-12 text-black mx-auto mb-3" />
              <p className="text-black font-medium mb-1">
                Click the "Upload Excel File" button above to select a file
              </p>
              <p className="text-sm text-black">
                Supported formats: .xlsx, .xls, .csv
              </p>
            </div>
          </div>
        )}

        {/* Available Template Variables - Show when Excel data is loaded */}
        {availableVariables.length > 0 && (
          <div className="p-4 bg-gray-50 border-2 border-black rounded-xl">
            <p className="text-sm font-semibold text-black mb-2">
              Available Template Variables from Excel:
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-black text-white text-xs rounded">{"{email}"}</span>
              {availableVariables.map((varName) => (
                <span key={varName} className="px-2 py-1 bg-black text-white text-xs rounded">
                  {"{" + varName + "}"}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs text-black">
              Use these variables in your email content (e.g., Hello {"{name}"}, your email is {"{email}"})
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipientsForm;

