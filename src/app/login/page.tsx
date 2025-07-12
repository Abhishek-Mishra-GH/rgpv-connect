import { UserAuthForm } from "@/components/user-auth-form";
import { Logo } from "@/components/logo";

function WelcomeGraphic() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/5 via-primary/10 to-primary/20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full animate-pulse" />
        <div
          className="absolute top-40 right-32 w-24 h-24 bg-primary/5 rounded-2xl rotate-45 animate-bounce"
          style={{ animationDuration: "3s" }}
        />
        <div
          className="absolute bottom-32 left-32 w-40 h-40 bg-primary/8 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-20 right-20 w-28 h-28 bg-primary/6 rounded-2xl rotate-12 animate-bounce"
          style={{ animationDuration: "4s" }}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      </div>

      {/* Main illustration */}
      <div className="relative z-10 max-w-md mx-auto px-8">
        <svg
          viewBox="0 0 400 300"
          className="w-full h-auto drop-shadow-lg"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background circle */}
          <circle
            cx="200"
            cy="150"
            r="120"
            fill="url(#backgroundGradient)"
            opacity="0.1"
          />

          {/* Students illustration */}
          <g>
            {/* Student 1 */}
            <circle cx="160" cy="120" r="20" fill="#3B82F6" opacity="0.8" />
            <rect
              x="140"
              y="140"
              width="40"
              height="50"
              rx="20"
              fill="#3B82F6"
              opacity="0.6"
            />
            <circle cx="160" cy="110" r="12" fill="#1E40AF" />

            {/* Student 2 */}
            <circle cx="240" cy="120" r="20" fill="#10B981" opacity="0.8" />
            <rect
              x="220"
              y="140"
              width="40"
              height="50"
              rx="20"
              fill="#10B981"
              opacity="0.6"
            />
            <circle cx="240" cy="110" r="12" fill="#047857" />

            {/* Student 3 */}
            <circle cx="200" cy="180" r="20" fill="#F59E0B" opacity="0.8" />
            <rect
              x="180"
              y="200"
              width="40"
              height="50"
              rx="20"
              fill="#F59E0B"
              opacity="0.6"
            />
            <circle cx="200" cy="170" r="12" fill="#D97706" />
          </g>

          {/* Connection lines */}
          <g
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.3"
            className="text-primary"
          >
            <line x1="160" y1="130" x2="240" y2="130" strokeDasharray="5,5">
              <animate
                attributeName="stroke-dashoffset"
                values="0;10"
                dur="2s"
                repeatCount="indefinite"
              />
            </line>
            <line x1="160" y1="140" x2="200" y2="180" strokeDasharray="5,5">
              <animate
                attributeName="stroke-dashoffset"
                values="0;10"
                dur="2.5s"
                repeatCount="indefinite"
              />
            </line>
            <line x1="240" y1="140" x2="200" y2="180" strokeDasharray="5,5">
              <animate
                attributeName="stroke-dashoffset"
                values="0;10"
                dur="3s"
                repeatCount="indefinite"
              />
            </line>
          </g>

          {/* Knowledge sharing symbols */}
          <g>
            {/* Books */}
            <rect
              x="120"
              y="80"
              width="15"
              height="20"
              rx="2"
              fill="#8B5CF6"
              opacity="0.7"
            />
            <rect
              x="125"
              y="75"
              width="15"
              height="20"
              rx="2"
              fill="#7C3AED"
              opacity="0.8"
            />

            {/* Light bulb */}
            <circle cx="280" cy="85" r="8" fill="#F59E0B" opacity="0.8" />
            <rect
              x="276"
              y="93"
              width="8"
              height="6"
              rx="1"
              fill="#D97706"
              opacity="0.6"
            />

            {/* Question mark */}
            <text
              x="150"
              y="60"
              fontSize="24"
              fill="currentColor"
              className="text-primary font-bold opacity-60"
            >
              ?
            </text>

            {/* Exclamation mark */}
            <text
              x="250"
              y="60"
              fontSize="24"
              fill="currentColor"
              className="text-primary font-bold opacity-60"
            >
              !
            </text>
          </g>

          {/* Floating particles */}
          <g>
            <circle cx="100" cy="100" r="2" fill="#3B82F6" opacity="0.6">
              <animate
                attributeName="cy"
                values="100;90;100"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="300" cy="120" r="2" fill="#10B981" opacity="0.6">
              <animate
                attributeName="cy"
                values="120;110;120"
                dur="2.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="80" cy="200" r="2" fill="#F59E0B" opacity="0.6">
              <animate
                attributeName="cy"
                values="200;190;200"
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="320" cy="180" r="2" fill="#8B5CF6" opacity="0.6">
              <animate
                attributeName="cy"
                values="180;170;180"
                dur="3.5s"
                repeatCount="indefinite"
              />
            </circle>
          </g>

          {/* Gradients */}
          <defs>
            <linearGradient
              id="backgroundGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#10B981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>

        {/* Welcome text overlay */}
        <div className="text-center mt-8 space-y-4">
          <h2 className="text-2xl font-bold text-foreground/80">
            Connect & Collaborate
          </h2>
          <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Join a vibrant community of students sharing knowledge, solving
            problems, and growing together.
          </p>

          {/* Feature highlights */}
          <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Ask Questions</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Share Knowledge</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Get AI Help</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Build Network</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <div className="flex justify-center">
              <Logo />
            </div>
            <h1 className="text-3xl font-bold font-headline">
              Welcome to RGPV Connect
            </h1>
            <p className="text-balance text-muted-foreground">
              Your community hub for guidance and collaboration.
            </p>
          </div>
          <UserAuthForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <a
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
      <div className="hidden lg:block">
        <WelcomeGraphic />
      </div>
    </div>
  );
}
