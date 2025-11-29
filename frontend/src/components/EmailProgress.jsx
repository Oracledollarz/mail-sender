import React from "react";
import { useSocket } from "../lib/context/SocketContext";
import {
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const EmailProgress = () => {
  const { emailProgress, emailStatus, resetProgress } = useSocket();

  if (!emailProgress && emailStatus === "idle") {
    return null;
  }

  const percentage = emailProgress
    ? Math.round((emailProgress.current / emailProgress.total) * 100)
    : 0;

  return (
    <div className="bg-white border-2 border-black rounded-2xl p-8 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-black border-2 border-black rounded-lg">
            <ChartBarIcon className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-black">Sending Progress</h2>
        </div>
        {emailStatus === "completed" && (
          <button
            onClick={resetProgress}
            className="p-2 text-black hover:text-black hover:bg-gray-100 rounded-lg transition-colors border-2 border-black"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {emailProgress && (
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="w-full bg-gray-200 border-2 border-black rounded-full h-8 overflow-hidden">
              <div
                className="h-full bg-black rounded-full transition-all duration-500 ease-out flex items-center justify-center text-white text-sm font-bold"
                style={{ width: `${percentage}%` }}
              >
                {percentage > 10 && `${percentage}%`}
              </div>
            </div>
            <div className="flex justify-between text-sm text-black">
              <span className="font-medium">
                Progress: {emailProgress.current} / {emailProgress.total}
              </span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircleIcon className="w-4 h-4" />
                  {emailProgress.successful || 0} successful
                </span>
                <span className="flex items-center gap-1 text-red-600">
                  <XCircleIcon className="w-4 h-4" />
                  {emailProgress.failed || 0} failed
                </span>
              </div>
            </div>
          </div>

          {/* Last Email Status */}
          {emailProgress.lastEmail && (
            <div
              className={`p-4 rounded-xl border-2 ${
                emailProgress.lastStatus === "success"
                  ? "bg-white border-green-500"
                  : "bg-white border-red-500"
              }`}
            >
              <div className="flex items-start gap-3">
                {emailProgress.lastStatus === "success" ? (
                  <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircleIcon className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-black">
                    {emailProgress.lastEmail}
                  </p>
                  <p
                    className={`text-sm ${
                      emailProgress.lastStatus === "success"
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {emailProgress.lastStatus === "success"
                      ? "Sent successfully"
                      : `Failed: ${emailProgress.lastError || "Unknown error"}`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Summary */}
          {emailStatus === "completed" && emailProgress.details && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-black">Summary</h3>
              <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
                {emailProgress.details.map((detail, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-2 ${
                      detail.status === "success"
                        ? "bg-white border-green-500"
                        : "bg-white border-red-500"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {detail.status === "success" ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-black truncate">
                          {detail.email}
                        </p>
                        {detail.status === "failed" && (
                          <p className="text-sm text-red-700 mt-1">
                            {detail.error || "Unknown error"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {emailStatus === "error" && emailProgress.error && (
            <div className="p-4 bg-white border-2 border-red-500 rounded-xl">
              <div className="flex items-start gap-3">
                <XCircleIcon className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-800">Error</p>
                  <p className="text-sm text-red-700 mt-1">
                    {emailProgress.error}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmailProgress;

