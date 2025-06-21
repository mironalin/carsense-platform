import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ErrorPage() {
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-lg border-red-200">
        <CardHeader className="bg-red-50 border-b border-red-100">
          <CardTitle className="flex items-center gap-2 text-red-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Something went wrong
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 pb-4">
          <p className="text-gray-600 mb-4">We encountered an error while loading this page. Please try again or contact support if the issue persists.</p>
          <div className="flex justify-end">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
            >
              Refresh page
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
