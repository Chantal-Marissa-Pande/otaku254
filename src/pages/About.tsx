export default function About() {
  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">

        <p className="text-purple-400 font-semibold uppercase tracking-widest text-sm mb-4">
          About Otaku254
        </p>

        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Your Home for Anime, Manga & K-pop
        </h1>

        <p className="max-w-3xl mx-auto text-gray-400 text-lg leading-relaxed">
          Otaku254 is a digital entertainment and fandom platform created
          for people who love anime, manga and K-pop. The system brings
          entertainment content, community discussions, personalized
          experiences and AI-powered assistance together in one place.
        </p>

      </section>


      {/* WHAT IS OTAKU254 */}
      <section className="max-w-6xl mx-auto px-6 pb-16">

        <div className="bg-[#171725] border border-white/10 rounded-2xl p-8 md:p-10">

          <h2 className="text-3xl font-bold mb-5">
            What is Otaku254?
          </h2>

          <p className="text-gray-400 leading-relaxed mb-5">
            Otaku254 is designed as a centralized online hub for fans
            interested in anime, manga and K-pop culture. Instead of
            separating articles, discussions and recommendations across
            different platforms, Otaku254 brings these experiences
            together in a single application.
          </p>

          <p className="text-gray-400 leading-relaxed">
            The platform combines a modern content management system,
            user authentication, community interaction and an AI
            assistant to create an interactive experience for fans.
          </p>

        </div>

      </section>


      {/* MAIN FEATURES */}
      <section className="max-w-6xl mx-auto px-6 pb-20">

        <div className="text-center mb-10">

          <p className="text-purple-400 font-semibold mb-2">
            PLATFORM FEATURES
          </p>

          <h2 className="text-3xl md:text-4xl font-bold">
            What You Can Do on Otaku254
          </h2>

          <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
            Explore content, interact with other fans and personalize
            the way you experience the platform.
          </p>

        </div>


        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* ANIME */}
          <FeatureCard
            icon="🎌"
            title="Anime"
            description="Discover anime-related articles, news, discussions and entertainment content."
          />

          {/* MANGA */}
          <FeatureCard
            icon="📚"
            title="Manga"
            description="Explore manga-focused content, stories, recommendations and fandom discussions."
          />

          {/* KPOP */}
          <FeatureCard
            icon="🎵"
            title="K-pop"
            description="Stay connected with K-pop culture, artists, trends and entertainment news."
          />

          {/* COMMUNITY */}
          <FeatureCard
            icon="💬"
            title="Community"
            description="Create posts, discuss your favourite topics and interact with other members of the Otaku254 community."
          />

          {/* AI */}
          <FeatureCard
            icon="🤖"
            title="Otaku AI"
            description="Ask the integrated AI assistant questions about anime, manga, K-pop, recommendations and fandom culture."
          />

          {/* PERSONALIZATION */}
          <FeatureCard
            icon="⚙️"
            title="Personalization"
            description="Customize your experience with appearance settings and content preferences for anime, manga and K-pop."
          />

        </div>

      </section>


      {/* HOW IT WORKS */}
      <section className="bg-[#141421] border-y border-white/10">

        <div className="max-w-6xl mx-auto px-6 py-20">

          <div className="text-center mb-12">

            <p className="text-purple-400 font-semibold mb-2">
              THE EXPERIENCE
            </p>

            <h2 className="text-3xl md:text-4xl font-bold">
              How Otaku254 Works
            </h2>

          </div>


          <div className="grid md:grid-cols-4 gap-6">

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


      {/* USER EXPERIENCE */}
      <section className="max-w-6xl mx-auto px-6 py-20">

        <div className="grid lg:grid-cols-2 gap-10 items-center">

          <div>

            <p className="text-purple-400 font-semibold mb-2">
              FOR MEMBERS
            </p>

            <h2 className="text-3xl md:text-4xl font-bold mb-5">
              Built Around the Fan
            </h2>

            <p className="text-gray-400 leading-relaxed mb-6">
              Otaku254 is designed to give users more than just articles.
              Registered members can maintain a profile, participate in
              the community and personalize their experience.
            </p>

            <div className="space-y-4">

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
                description="Choose whether anime, manga and K-pop content is relevant to your interests."
              />

              <InfoRow
                icon="🌙"
                title="Theme Preferences"
                description="Choose between dark mode, light mode or your system preference."
              />

            </div>

          </div>


          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/10 border border-purple-500/20 rounded-3xl p-8">

            <div className="text-6xl mb-6">
              🌟
            </div>

            <h3 className="text-2xl font-bold mb-4">
              One Platform. Multiple Fandoms.
            </h3>

            <p className="text-gray-400 leading-relaxed">
              Whether you are catching up on the latest anime,
              looking for manga recommendations, following K-pop
              trends or simply talking with other fans, Otaku254
              provides a single space to explore and connect.
            </p>

          </div>

        </div>

      </section>


      {/* TECHNOLOGY */}
      <section className="bg-[#141421] border-y border-white/10">

        <div className="max-w-6xl mx-auto px-6 py-20">

          <div className="text-center mb-10">

            <p className="text-purple-400 font-semibold mb-2">
              TECHNOLOGY
            </p>

            <h2 className="text-3xl md:text-4xl font-bold">
              Powered by Modern Technology
            </h2>

            <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
              Otaku254 is built using technologies designed to support
              a responsive, interactive and scalable web experience.
            </p>

          </div>


          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

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
      <section className="max-w-6xl mx-auto px-6 py-20">

        <div className="bg-[#171725] border border-white/10 rounded-2xl p-8 md:p-10">

          <div className="grid md:grid-cols-[auto_1fr] gap-6">

            <div className="text-5xl">
              🛠️
            </div>

            <div>

              <p className="text-purple-400 font-semibold mb-2">
                CONTENT MANAGEMENT
              </p>

              <h2 className="text-3xl font-bold mb-4">
                Managed Through an Admin System
              </h2>

              <p className="text-gray-400 leading-relaxed mb-5">
                Otaku254 includes administrative functionality for
                managing the platform's content. Authorized administrators
                can publish and manage articles, categories and other
                platform information through protected administration
                features.
              </p>

              <p className="text-gray-400 leading-relaxed">
                This allows the platform to maintain dynamic content
                rather than relying on static pages.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* VISION */}
      <section className="max-w-5xl mx-auto px-6 pb-24 text-center">

        <div className="bg-gradient-to-r from-purple-600/20 via-pink-600/10 to-purple-600/20 border border-purple-500/20 rounded-3xl p-10 md:p-14">

          <p className="text-purple-400 font-semibold mb-3">
            THE VISION
          </p>

          <h2 className="text-3xl md:text-4xl font-bold mb-5">
            More Than a Blog
          </h2>

          <p className="text-gray-400 leading-relaxed max-w-3xl mx-auto">
            Otaku254 is designed to grow from an entertainment blog
            into a broader digital fandom ecosystem where fans can
            discover content, exchange ideas, receive recommendations,
            interact with AI and build a community around the interests
            they love.
          </p>

        </div>

      </section>


    </div>
  );
}


/*
 * FEATURE CARD
 */
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
    <div className="bg-[#171725] border border-white/10 rounded-2xl p-6 hover:border-purple-500/40 hover:-translate-y-1 transition-all duration-200">

      <div className="text-4xl mb-4">
        {icon}
      </div>

      <h3 className="text-xl font-semibold mb-2">
        {title}
      </h3>

      <p className="text-gray-400 text-sm leading-relaxed">
        {description}
      </p>

    </div>
  );
}


/*
 * STEP CARD
 */
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

      <div className="w-12 h-12 mx-auto mb-5 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
        {number}
      </div>

      <h3 className="text-lg font-semibold mb-2">
        {title}
      </h3>

      <p className="text-gray-400 text-sm leading-relaxed">
        {description}
      </p>

    </div>
  );
}


/*
 * INFORMATION ROW
 */
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

      <div className="w-10 h-10 shrink-0 rounded-lg bg-purple-600/10 flex items-center justify-center">
        {icon}
      </div>

      <div>
        <h3 className="font-semibold">
          {title}
        </h3>

        <p className="text-sm text-gray-400 mt-1">
          {description}
        </p>
      </div>

    </div>
  );
}


/*
 * TECHNOLOGY CARD
 */
function TechCard({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return (
    <div className="bg-[#171725] border border-white/10 rounded-xl p-5">

      <h3 className="font-semibold mb-2">
        {name}
      </h3>

      <p className="text-sm text-gray-400 leading-relaxed">
        {description}
      </p>

    </div>
  );
}