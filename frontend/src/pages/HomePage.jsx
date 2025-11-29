import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useEmailSender } from "../hooks/useEmailSender";
import { useSocket } from "../lib/context/SocketContext";
import SMTPConfigForm from "../components/SMTPConfigForm";
import EmailContentForm from "../components/EmailContentForm";
import RecipientsForm from "../components/RecipientsForm";
import EmailProgress from "../components/EmailProgress";
import {
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const validationSchema = Yup.object().shape({
  smtpConfig: Yup.object().shape({
    host: Yup.string().required("SMTP host is required"),
    port: Yup.number().required("SMTP port is required").min(1).max(65535),
    secure: Yup.boolean(),
    user: Yup.string()
      .email("Invalid email")
      .required("Email/Username is required"),
    password: Yup.string().required("Password is required"),
  }),
  emailData: Yup.object().shape({
    from: Yup.string()
      .email("Invalid email")
      .required("From email is required"),
    subject: Yup.string().required("Subject is required"),
    html: Yup.string().required("Email body is required"),
  }),
  recipients: Yup.string().required("At least one recipient is required"),
});

const initialValues = {
  smtpConfig: {
    host: "",
    port: 587,
    secure: false,
    user: "",
    password: "",
    senderName: "",
    senderImage: "",
  },
  emailData: {
    from: "",
    subject: "",
    html: "",
  },
  recipients: "",
  recipientsData: null,
};

const HomePage = () => {
  const { loading, error, testConnection, uploadExcel, sendEmails } =
    useEmailSender();
  const { emailStatus, resetProgress } = useSocket();

  const handleTestConnection = async (values) => {
    try {
      await testConnection(values.smtpConfig);
      alert("SMTP connection successful!");
    } catch (err) {
      alert("SMTP connection failed: " + (err.message || "Unknown error"));
    }
  };

  const handleExcelUpload = async (file) => {
    return await uploadExcel(file, null, "email", true);
  };

  const handleSubmit = async (values) => {
    try {
      resetProgress();

      // Prepare email data with sender name
      const emailDataWithSender = {
        ...values.emailData,
        fromName: values.smtpConfig.senderName || undefined,
      };

      // If recipientsData exists (from Excel), use it, otherwise parse recipients string
      let recipients = [];
      let recipientsData = values.recipientsData;

      if (
        recipientsData &&
        Array.isArray(recipientsData) &&
        recipientsData.length > 0
      ) {
        recipients = recipientsData.map((r) => r.email || r);
      } else {
        recipients = values.recipients
          .split(",")
          .map((email) => email.trim())
          .filter((email) => email);
        recipientsData = null;
      }

      await sendEmails(
        values.smtpConfig,
        emailDataWithSender,
        recipients,
        recipientsData
      );
    } catch (err) {
      console.error("Error sending emails:", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 border-2 border-black rounded-full mb-4">
          <EnvelopeIcon className="w-10 h-10 text-black" />
        </div>
        <h1 className="text-5xl font-light text-black mb-2">
          VornDuty's Email Sender 
        </h1>
        <p className="text-black text-lg">
          Send bulk emails with real-time progress tracking
        </p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isValid }) => (
          <Form className="space-y-6">
            <SMTPConfigForm />

            {/* Test Connection Button */}
            <div className="bg-white border-2 border-black rounded-2xl p-6 animate-slide-up">
              <button
                type="button"
                onClick={() => handleTestConnection(values)}
                disabled={loading}
                className="w-full px-6 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border-2 border-black"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Testing Connection...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="w-5 h-5" />
                    Test SMTP Connection
                  </>
                )}
              </button>
            </div>

            <EmailContentForm />
            <RecipientsForm onExcelUpload={handleExcelUpload} />

            {/* Error Message */}
            {error && (
              <div className="bg-white border-2 border-red-500 p-4 rounded-lg animate-slide-up">
                <div className="flex items-center">
                  <XCircleIcon className="w-6 h-6 text-red-500 mr-2" />
                  <div>
                    <p className="text-red-800 font-semibold">Error</p>
                    <p className="text-red-600">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="bg-white border-2 border-black rounded-2xl p-6 animate-slide-up">
              <button
                type="submit"
                disabled={loading || emailStatus === "sending" || !isValid}
                className="w-full px-8 py-4 bg-black text-white font-bold text-lg rounded-xl hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 border-2 border-black"
              >
                {loading || emailStatus === "sending" ? (
                  <>
                    <svg
                      className="animate-spin h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending Emails...
                  </>
                ) : (
                  <>
                    <EnvelopeIcon className="w-6 h-6" />
                    Send Emails
                  </>
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <EmailProgress />
    </div>
  );
};

export default HomePage;
