import { Calendar, MessageCircle, Users } from 'lucide-react';

export const BenefitsSection = () => {
  return (
    <section className="bg-gray-50 dark:bg-gray-800/50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Calendar className="h-12 w-12 text-primary-700 dark:text-primary-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Events</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Code together nights, hackathons and educational talks from tech leaders in Regina.
            </p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <MessageCircle className="h-12 w-12 text-primary-700 dark:text-primary-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Connections</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Talk tech, meet people, get help, learn something new. Join the discussion on Slack
              below!
            </p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Users className="h-12 w-12 text-primary-700 dark:text-primary-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Community</h3>
            <p className="text-gray-600 dark:text-gray-400">
              A network of Regina tech companies to share knowledge and help Regina stay ahead of
              the latest technologies.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
