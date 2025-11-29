import React from "react";
import { useField } from "formik";
import {
  ServerIcon,
  KeyIcon,
  EnvelopeIcon,
  LockClosedIcon,
  XCircleIcon,
  UserIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

const SMTPConfigForm = () => {
  const [hostField, hostMeta] = useField("smtpConfig.host");
  const [portField, portMeta] = useField("smtpConfig.port");
  const [secureField] = useField("smtpConfig.secure");
  const [userField, userMeta] = useField("smtpConfig.user");
  const [passwordField, passwordMeta] = useField("smtpConfig.password");
  const [senderNameField] = useField("smtpConfig.senderName");
  const [senderImageField] = useField("smtpConfig.senderImage");

  return (
    <div className="bg-white border-2 border-black rounded-2xl p-8 animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-black border-2 border-black rounded-lg">
          <ServerIcon className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-black">SMTP Configuration</h2>
      </div>

      <div className="space-y-5">
        {/* SMTP Host */}
        <div>
          <label
            className="block text-sm font-semibold text-black mb-2"
            htmlFor="smtp-host"
          >
            SMTP Host <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ServerIcon className="h-5 w-5 text-black" />
            </div>
            <input
              id="smtp-host"
              type="text"
              className="w-full pl-10 pr-4 py-3 border-2 border-black rounded-xl focus:border-black transition-all duration-200 outline-none"
              placeholder="smtp.gmail.com"
              {...hostField}
            />
          </div>
          {hostMeta.touched && hostMeta.error && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <XCircleIcon className="w-4 h-4" />
              {hostMeta.error}
            </p>
          )}
        </div>

        {/* SMTP Port */}
        <div>
          <label
            className="block text-sm font-semibold text-black mb-2"
            htmlFor="smtp-port"
          >
            SMTP Port <span className="text-red-500">*</span>
          </label>
          <input
            id="smtp-port"
            type="number"
            className="w-full px-4 py-3 border-2 border-black rounded-xl focus:border-black transition-all duration-200 outline-none"
            placeholder="587"
            {...portField}
          />
          {portMeta.touched && portMeta.error && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <XCircleIcon className="w-4 h-4" />
              {portMeta.error}
            </p>
          )}
        </div>

        {/* Secure Checkbox */}
        <div className="flex items-center">
          <input
            id="smtp-secure"
            type="checkbox"
            className="w-5 h-5 text-black border-2 border-black rounded focus:ring-black focus:ring-2"
            {...secureField}
          />
          <label
            className="ml-3 flex items-center gap-2 text-sm font-medium text-black cursor-pointer"
            htmlFor="smtp-secure"
          >
            <LockClosedIcon className="w-5 h-5 text-black" />
            Use SSL/TLS (Secure)
          </label>
        </div>

        {/* Email/Username */}
        <div>
          <label
            className="block text-sm font-semibold text-black mb-2"
            htmlFor="smtp-user"
          >
            Email/Username <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <EnvelopeIcon className="h-5 w-5 text-black" />
            </div>
            <input
              id="smtp-user"
              type="email"
              className="w-full pl-10 pr-4 py-3 border-2 border-black rounded-xl focus:border-black transition-all duration-200 outline-none"
              placeholder="your-email@gmail.com"
              {...userField}
            />
          </div>
          {userMeta.touched && userMeta.error && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <XCircleIcon className="w-4 h-4" />
              {userMeta.error}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            className="block text-sm font-semibold text-black mb-2"
            htmlFor="smtp-password"
          >
            Password/App Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <KeyIcon className="h-5 w-5 text-black" />
            </div>
            <input
              id="smtp-password"
              type="password"
              className="w-full pl-10 pr-4 py-3 border-2 border-black rounded-xl focus:border-black transition-all duration-200 outline-none"
              placeholder="Your email password or app password"
              {...passwordField}
            />
          </div>
          {passwordMeta.touched && passwordMeta.error && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <XCircleIcon className="w-4 h-4" />
              {passwordMeta.error}
            </p>
          )}
        </div>

        {/* Sender Name */}
        <div>
          <label
            className="block text-sm font-semibold text-black mb-2"
            htmlFor="smtp-sender-name"
          >
            Sender Name (Optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserIcon className="h-5 w-5 text-black" />
            </div>
            <input
              id="smtp-sender-name"
              type="text"
              className="w-full pl-10 pr-4 py-3 border-2 border-black rounded-xl focus:border-black transition-all duration-200 outline-none"
              placeholder="John Doe"
              {...senderNameField}
            />
          </div>
          <p className="mt-1 text-xs text-black">
            This name will appear as the sender in recipient's inbox
          </p>
        </div>

        {/* Sender Image/Logo URL */}
        <div>
          <label
            className="block text-sm font-semibold text-black mb-2"
            htmlFor="smtp-sender-image"
          >
            Sender Logo/Profile Image URL (Optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <PhotoIcon className="h-5 w-5 text-black" />
            </div>
            <input
              id="smtp-sender-image"
              type="url"
              className="w-full pl-10 pr-4 py-3 border-2 border-black rounded-xl focus:border-black transition-all duration-200 outline-none"
              placeholder="https://example.com/logo.png"
              {...senderImageField}
            />
          </div>
          <p className="mt-1 text-xs text-black">
            URL to your logo or profile image (will be embedded in email)
          </p>
        </div>
      </div>
    </div>
  );
};

export default SMTPConfigForm;

