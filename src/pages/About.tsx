export default function About() {
  return (
    <main className="theme-page min-h-screen">

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28 text-center">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-500">
            <span>✨</span>
            About Otaku254
          </div>

          <h1 className="theme-heading mx-auto max-w-4xl text-4xl md:text-6xl font-bold tracking-tight">
            Your Home for Anime,
            <span className="block bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Manga & K-pop
            </span>
          </h1>

          <p className="theme-muted mx-auto mt-6 max-w-3xl text-lg leading-relaxed">
            Otaku254 is a digital entertainment and
            fandom platform created for people who
            love anime, manga and K-pop. It brings
            entertainment content, community
            discussions, personalized experiences and
            AI-powered assistance together in one place.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Badge text="Anime" icon="🎌" />
            <Badge text="Manga" icon="📚" />
            <Badge text="K-pop" icon="🎵" />
            <Badge text="Community" icon="💬" />
            <Badge text="Otaku AI" icon="🤖" />
          </div>

        </div>
      </section>


      {/* WHAT IS OTAKU254 */}
      <section className="mx-auto max-w-6xl px-6 pb-16">

        <div className="theme-card rounded-3xl border p-8 md:p-10 shadow-sm">

          <div className="flex items-start gap-5">

            <div className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-purple-500/10 text-3xl">
              🌟
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-purple-500">
                The Platform
              </p>

              <h2 className="theme-heading text-3xl font-bold mb-5">
                What is Otaku254?
              </h2>

              <p className="theme-muted leading-relaxed mb-5">
                Otaku254 is designed as a centralized
                online hub for fans interested in anime,
                manga and K-pop culture. Instead of
                separating articles, discussions and
                recommendations across different
                platforms, Otaku254 brings these
                experiences together in a single
                application.
              </p>

              <p className="theme-muted leading-relaxed">
                The platform combines a modern content
                management system, user authentication,
                community interaction and an AI assistant
                to create an interactive experience for
                fans.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-6 pb-20">

        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-purple-500">
            Platform Features
          </p>

          <h2 className="theme-heading text-3xl md:text-4xl font-bold">
            What You Can Do on Otaku254
          </h2>

          <p className="theme-muted mx-auto mt-3 max-w-2xl">
            Explore content, interact with other fans
            and personalize the way you experience
            the platform.
          </p>
        </div>


        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          <FeatureCard
            icon="🎌"
            title="Anime"
            description="Discover anime-related articles, news, discussions and entertainment content."
          />

          <FeatureCard
            icon="📚"
            title="Manga"
            description="Explore manga-focused content, stories, recommendations and fandom discussions."
          />

          <FeatureCard
            icon="🎵"
            title="K-pop"
            description="Stay connected with K-pop culture, artists, trends and entertainment news."
          />

          <FeatureCard
            icon="💬"
            title="Community"
            description="Create posts, discuss your favourite topics and interact with other members of the Otaku254 community."
          />

          <FeatureCard
            icon="🤖"
            title="Otaku AI"
            description="Ask the integrated AI assistant questions about anime, manga, K-pop, recommendations and fandom culture."
          />

          <FeatureCard
            icon="⚙️"
            title="Personalization"
            description="Customize your experience with appearance settings and content preferences."
          />

        </div>

      </section>


      {/* HOW IT WORKS */}
      <section className="theme-section border-y">

        <div className="mx-auto max-w-6xl px-6 py-20">

          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-purple-500">
              The Experience
            </p>

            <h2 className="theme-heading text-3xl md:text-4xl font-bold">
              How Otaku254 Works
            </h2>
          </div>


          <div className="grid gap-8 md:grid-cols-4">

            <StepCard
              number="01"
              title="Explore"
              description="Browse anime, manga, K-pop and other entertainment content."
            />

            <StepCard
              number="02"
              title="Discover"
              description="Find articles, featured posts and content based on your interests."
            />

            <StepCard
              number="03"
              title="Connect"
              description="Join the community, create discussions and share your thoughts."
            />

            <StepCard
              number="04"
              title="Ask Otaku AI"
              description="Use the AI assistant to ask questions and discover new recommendations."
            />

          </div>

        </div>

      </section>


      {/* MEMBER EXPERIENCE */}
      <section className="mx-auto max-w-6xl px-6 py-20">

        <div className="grid items-center gap-10 lg:grid-cols-2">

          <div>

            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-purple-500">
              For Members
            </p>

            <h2 className="theme-heading mb-5 text-3xl md:text-4xl font-bold">
              Built Around the Fan
            </h2>

            <p className="theme-muted mb-7 leading-relaxed">
              Otaku254 is designed to give users more
              than just articles. Registered members can
              maintain a profile, participate in the
              community and personalize their experience.
            </p>

            <div className="space-y-5">

              <InfoRow
                icon="👤"
                title="User Profiles"
                description="Manage your account and view your Otaku254 profile."
              />

              <InfoRow
                icon="💬"
                title="Community Discussions"
                description="Create posts and participate in conversations with other fans."
              />

              <InfoRow
                icon="🎯"
                title="Content Preferences"
                description="Choose which categories are relevant to your interests."
              />

              <InfoRow
                icon="🌙"
                title="Theme Preferences"
                description="Choose between dark mode, light mode or your system preference."
              />

            </div>

          </div>


          <div className="theme-gradient-card rounded-3xl border p-8 md:p-10">

            <div className="mb-6 text-6xl">
              🌟
            </div>

            <h3 className="theme-heading mb-4 text-2xl font-bold">
              One Platform. Multiple Fandoms.
            </h3>

            <p className="theme-muted leading-relaxed">
              Whether you are catching up on the latest
              anime, looking for manga recommendations,
              following K-pop trends or simply talking
              with other fans, Otaku254 provides a single
              space to explore and connect.
            </p>

          </div>

        </div>

      </section>


      {/* TECHNOLOGY */}
      <section className="theme-section border-y">

        <div className="mx-auto max-w-6xl px-6 py-20">

          <div className="mb-10 text-center">

            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-purple-500">
              Technology
            </p>

            <h2 className="theme-heading text-3xl md:text-4xl font-bold">
              Powered by Modern Technology
            </h2>

            <p className="theme-muted mx-auto mt-3 max-w-2xl">
              Otaku254 is built using technologies
              designed to support a responsive,
              interactive and scalable web experience.
            </p>

          </div>


          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            <TechCard
              name="React + TypeScript"
              description="Frontend application and interactive user interface."
            />

            <TechCard
              name="Tailwind CSS"
              description="Responsive styling and modern interface design."
            />

            <TechCard
              name="Firebase Authentication"
              description="Secure user authentication and account management."
            />

            <TechCard
              name="Cloud Firestore"
              description="Cloud database for content, users and community data."
            />

            <TechCard
              name="Node.js + Express"
              description="Backend services supporting the application."
            />

            <TechCard
              name="AI Integration"
              description="AI-powered interaction through the Otaku AI assistant."
            />

          </div>

        </div>

      </section>


      {/* ADMIN SYSTEM */}
      <section className="mx-auto max-w-6xl px-6 py-20">

        <div className="theme-card rounded-3xl border p-8 md:p-10 shadow-sm">

          <div className="flex items-start gap-6">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-purple-500/10 text-3xl">
              🛠️
            </div>

            <div>

              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-purple-500">
                Content Management
              </p>

              <h2 className="theme-heading mb-4 text-3xl font-bold">
                Managed Through an Admin System
              </h2>

              <p className="theme-muted mb-5 leading-relaxed">
                Otaku254 includes administrative
                functionality for managing the platform's
                content. Authorized administrators can
                publish and manage articles, categories
                and other platform information through
                protected administration features.
              </p>

              <p className="theme-muted leading-relaxed">
                This allows the platform to maintain
                dynamic content rather than relying on
                static pages.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* VISION */}
      <section className="mx-auto max-w-5xl px-6 pb-24">

        <div className="theme-gradient-card rounded-3xl border p-10 text-center md:p-14">

          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-purple-500">
            The Vision
          </p>

          <h2 className="theme-heading mb-5 text-3xl md:text-4xl font-bold">
            More Than a Blog
          </h2>

          <p className="theme-muted mx-auto max-w-3xl leading-relaxed">
            Otaku254 is designed to grow from an
            entertainment blog into a broader digital
            fandom ecosystem where fans can discover
            content, exchange ideas, receive
            recommendations, interact with AI and build
            a community around the interests they love.
          </p>

        </div>

      </section>

    </main>
  );
}


/* BADGE */
function Badge({
  text,
  icon,
}: {
  text: string;
  icon: string;
}) {
  return (
    <span className="theme-badge inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm">
      <span>{icon}</span>
      {text}
    </span>
  );
}


/* FEATURE CARD */
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="theme-card group rounded-2xl border p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-lg">

      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-2xl transition-transform duration-200 group-hover:scale-110">
        {icon}
      </div>

      <h3 className="theme-heading mb-2 text-xl font-semibold">
        {title}
      </h3>

      <p className="theme-muted text-sm leading-relaxed">
        {description}
      </p>

    </div>
  );
}


/* STEP CARD */
function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">

      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-purple-500/30 bg-purple-500/10 font-bold text-purple-500">
        {number}
      </div>

      <h3 className="theme-heading mb-2 text-lg font-semibold">
        {title}
      </h3>

      <p className="theme-muted text-sm leading-relaxed">
        {description}
      </p>

    </div>
  );
}


/* INFORMATION ROW */
function InfoRow({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10">
        {icon}
      </div>

      <div>
        <h3 className="theme-heading font-semibold">
          {title}
        </h3>

        <p className="theme-muted mt-1 text-sm">
          {description}
        </p>
      </div>

    </div>
  );
}


/* TECHNOLOGY CARD */
function TechCard({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return (
    <div className="theme-card rounded-2xl border p-5 shadow-sm">

      <div className="mb-3 h-1 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />

      <h3 className="theme-heading mb-2 font-semibold">
        {name}
      </h3>

      <p className="theme-muted text-sm leading-relaxed">
        {description}
      </p>

    </div>
  );
}