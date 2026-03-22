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

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT || '';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [contactText, setContactText] = useState<RichText | null>(null);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!FORMSPREE_ENDPOINT) {
      setStatus('error');
      return;
    }

    setStatus('submitting');

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          _subject: formData.subject,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => {
    getContactText()
      .then((data) => {
        setContactText(data);
      })
      .catch((error) => console.error('Error fetching contact text:', error));
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
              {contactText?.content && <PortableText value={contactText.content} />}
            </div>
            <MiniSocialLinks />
          </div>
          {/* Right Column: Contact Form */}
          <div>
            {status === 'success' ? (
              <div className="p-4 border border-green-500 text-green-700 dark:text-green-400">
                <p className="font-bold">Thank you for your message!</p>
                <p>I'll get back to you as soon as possible.</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-4 text-primary dark:text-secondary hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
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
                    className={`w-full p-2 border rounded-none bg-transparent text-primary dark:text-secondary ${
                      errors.name
                        ? 'border-red-500'
                        : 'border-primary dark:border-secondary'
                    }`}
                    disabled={status === 'submitting'}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
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
                    className={`w-full p-2 border rounded-none bg-transparent text-primary dark:text-secondary ${
                      errors.email
                        ? 'border-red-500'
                        : 'border-primary dark:border-secondary'
                    }`}
                    disabled={status === 'submitting'}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
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
                    className={`w-full p-2 border rounded-none bg-transparent text-primary dark:text-secondary ${
                      errors.subject
                        ? 'border-red-500'
                        : 'border-primary dark:border-secondary'
                    }`}
                    disabled={status === 'submitting'}
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                  )}
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
                    className={`w-full p-2 border rounded-none bg-transparent text-primary dark:text-secondary h-32 ${
                      errors.message
                        ? 'border-red-500'
                        : 'border-primary dark:border-secondary'
                    }`}
                    disabled={status === 'submitting'}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                  )}
                </div>
                {status === 'error' && (
                  <p className="text-red-500">
                    {FORMSPREE_ENDPOINT
                      ? 'Failed to send message. Please try again.'
                      : 'Contact form is not configured. Please set VITE_FORMSPREE_ENDPOINT.'}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="px-6 py-3 bg-primary dark:bg-secondary text-secondary dark:text-primary hover:underline disabled:opacity-50"
                >
                  {status === 'submitting' ? 'Sending...' : 'Send'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </ContentPage>
  );
};

export default Contact;
