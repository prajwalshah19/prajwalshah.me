// src/pages/Contact.tsx
import React, { useState, useEffect } from 'react';
import ContentPage from '../components/ContentPage';
import MiniSocialLinks from '../components/MiniSocialLinks';
import { RichText, getContactText } from '../services/textData';
import { PortableText } from '@portabletext/react';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [contactText, setContactText] = useState<RichText | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted', formData);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  useEffect(() => {
    getContactText()
      .then((data) => {
        //console.log('Fetched contact:', data);
        setContactText(data);
      })
      .catch((error) => console.error('Error fetching bio:', error));
  }, []);

  return (
    <ContentPage>
      <div className="w-full lg:w-3/5 mx-auto py-8 px-4 space-y-8">
        <h1 className="text-6xl font-body text-primary dark:text-secondary text-center mb-8">
          Lets talk
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Bio & Social */}
          <div className="flex flex-col justify-center space-y-4">
            <h2 className="hidden lg:block text-4xl font-bold text-primary dark:text-secondary">
              Prajwal Shah
            </h2>
            <div className="text-lg text-primary dark:text-secondary">
              <PortableText value={contactText?.content} />
            </div>
            <MiniSocialLinks />
          </div>
          {/* Right Column: Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block font-body text-primary dark:text-secondary mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-primary dark:border-secondary rounded-none bg-transparent text-primary dark:text-secondary"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block font-body text-primary dark:text-secondary mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border border-primary dark:border-secondary rounded-none bg-transparent text-primary dark:text-secondary"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block font-body text-primary dark:text-secondary mb-1"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full p-2 border border-primary dark:border-secondary rounded-none bg-transparent text-primary dark:text-secondary"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block font-body text-primary dark:text-secondary mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-2 border border-primary dark:border-secondary rounded-none bg-transparent text-primary dark:text-secondary h-32"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-primary dark:bg-secondary text-secondary dark:text-primary hover:underline"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </ContentPage>
  );
};

export default Contact;
