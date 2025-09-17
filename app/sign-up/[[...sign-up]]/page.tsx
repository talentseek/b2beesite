import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 to-orange-500">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: "bg-orange-500 hover:bg-orange-600",
              card: "shadow-none",
              headerTitle: "text-2xl font-bold text-gray-900",
              headerSubtitle: "text-gray-600"
            }
          }}
        />
      </div>
    </div>
  );
}
