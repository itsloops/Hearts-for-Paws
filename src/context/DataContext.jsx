import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }) {
  // Helper to load from localStorage or fall back to default
  const loadState = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return defaultValue;
      const parsed = JSON.parse(saved);
      // Ensure we don't return null if parsing resulted in null
      return parsed === null ? defaultValue : parsed;
    } catch (e) {
      console.error("Error loading state from localStorage", e);
      return defaultValue;
    }
  };

  // --- Lost & Found State ---
  const defaultPosts = [
    {
      id: 1,
      type: 'lost',
      name: 'Buddy',
      breed: 'Golden Retriever',
      location: 'Central Park',
      date: '2023-10-25',
      description: 'Wearing a red collar. Needs daily medication for allergies. Very friendly.',
      image: null,
      status: 'lost',
      userId: '123', // Demo user ID
      contactEmail: 'owner@example.com',
      contactPhone: '555-0101'
    },
    {
      id: 2,
      type: 'found',
      name: 'Unknown',
      breed: 'Siamese Cat',
      location: 'Downtown',
      date: '2023-10-26',
      image: null,
      status: 'found',
      userId: '999', // Another user
      contactEmail: 'finder@example.com',
      contactPhone: '555-0102'
    }
  ];

  const [posts, setPosts] = useState(() => loadState('hfp_posts_live', defaultPosts));

  useEffect(() => {
    localStorage.setItem('hfp_posts_live', JSON.stringify(posts));
  }, [posts]);

  const addPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const updatePostStatus = (id) => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        return { ...post, status: post.status === 'reunited' ? post.type : 'reunited' };
      }
      return post;
    }));
  };

  const updatePost = (id, updatedPost) => {
    setPosts(posts.map(post => post.id === id ? { ...post, ...updatedPost } : post));
  };

  const deletePost = (id) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  // --- Donations State ---
  const defaultDonations = [];

  const [donationRequests, setDonationRequests] = useState(() => loadState('hfp_donations', defaultDonations));

  useEffect(() => {
    localStorage.setItem('hfp_donations', JSON.stringify(donationRequests));
  }, [donationRequests]);

  const toggleDonationStatus = (id, userId) => {
    setDonationRequests(donationRequests.map(req => {
        if (req.id === id) {
            // If currently fulfilled
            if (req.fulfilled) {
                // Only allow un-fulfilling if the same user pledged it (or we don't track pledger yet for legacy items)
                if (req.pledgedBy === userId || !req.pledgedBy) {
                    return { ...req, fulfilled: false, pledgedBy: null };
                }
                // If someone else pledged it, do nothing (or handle error, but UI should prevent this)
                return req;
            }
            // If not fulfilled, fulfill it
            return { ...req, fulfilled: true, pledgedBy: userId };
        }
        return req;
    }));
  };

  const addDonationRequest = (request) => {
    setDonationRequests([...donationRequests, request]);
  };

  const updateDonationRequest = (id, updatedRequest) => {
    setDonationRequests(donationRequests.map(req => req.id === id ? { ...req, ...updatedRequest } : req));
  };

  const deleteDonationRequest = (id) => {
    setDonationRequests(donationRequests.filter(req => req.id !== id));
  };

  // --- Community Events State ---
  const defaultEvents = [
    {
      id: 1,
      title: 'Mega Adoption Weekend',
      date: '2023-11-15',
      time: '10:00 AM - 4:00 PM',
      location: 'City Park Pavilion',
      type: 'Adoption Drive',
      description: 'Come meet over 50 dogs and cats looking for their forever homes! Adoption fees waived.',
      image: null,
      userId: '999',
      contactEmail: 'events@citypark.com'
    },
    {
      id: 2,
      title: 'Low-Cost Vaccination Clinic',
      date: '2023-11-20',
      time: '9:00 AM - 2:00 PM',
      location: 'Community Center',
      type: 'Vaccination',
      description: 'Rabies and distemper vaccines available for $10. Microchipping for $15.',
      image: null,
      userId: '999',
      contactEmail: 'vet@community.org'
    },
    {
      id: 3,
      title: 'Sunday Morning Pack Walk',
      date: '2023-11-12',
      time: '9:00 AM - 10:30 AM',
      location: 'Riverside Trail Head',
      type: 'Walking Group',
      description: 'A casual group walk for dogs of all sizes. Reactive dogs welcome (yellow ribbon required).',
      image: null,
      userId: '123',
      contactEmail: 'walker@example.com'
    },
    {
      id: 4,
      title: 'Small Dog Playdate',
      date: '2023-11-18',
      time: '2:00 PM - 3:30 PM',
      location: 'Bark Park - Small Dog Section',
      type: 'Social Meetup',
      description: 'Let the little ones run free! Snacks provided for humans.',
      image: null,
      userId: '123',
      contactEmail: 'playdate@example.com'
    }
  ];

  const [events, setEvents] = useState(() => loadState('hfp_events_live', defaultEvents));

  useEffect(() => {
    localStorage.setItem('hfp_events_live', JSON.stringify(events));
  }, [events]);

  const addEvent = (newEvent) => {
    setEvents([...events, newEvent]);
  };

  const updateEvent = (id, updatedEvent) => {
    setEvents(events.map(event => event.id === id ? { ...event, ...updatedEvent } : event));
  };

  const deleteEvent = (id) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const toggleEventAttendance = (eventId, userId) => {
    setEvents(events.map(event => {
        if (event.id === eventId) {
            const attendees = event.attendees || [];
            const isAttending = attendees.includes(userId);
            return {
                ...event,
                attendees: isAttending 
                    ? attendees.filter(id => id !== userId) 
                    : [...attendees, userId]
            };
        }
        return event;
    }));
  };

  // --- Rescues & Fosters State ---
  const defaultOrgs = [
    {
      id: 'org1',
      name: 'Happy Paws Rescue',
      location: 'Downtown Metro',
      description: 'Dedicated to rescuing stray dogs and cats.',
      contactEmail: 'org@hfp.com',
      image: null,
      userId: 'org1'
    }
  ];

  const [organizations, setOrganizations] = useState(() => loadState('hfp_orgs_live', defaultOrgs));

  useEffect(() => {
    localStorage.setItem('hfp_orgs_live', JSON.stringify(organizations));
  }, [organizations]);

  const addOrganization = (newOrg) => {
    setOrganizations([...organizations, newOrg]);
  };

  const updateOrganization = (id, updatedOrg) => {
    setOrganizations(organizations.map(org => org.id === id ? { ...org, ...updatedOrg } : org));
  };

  const deleteOrganization = (id) => {
    setOrganizations(organizations.filter(org => org.id !== id));
  };

  // --- Messaging State ---
  const defaultMessages = [
    {
      id: 1,
      fromUserId: '999',
      toUserId: '123',
      senderName: 'Jane Doe',
      subject: 'Found your dog Buddy',
      content: 'Hi! I think I saw Buddy near the park entrance this morning. He looked safe but scared.',
      date: '2023-10-26T10:30:00',
      read: false
    }
  ];

  const [messages, setMessages] = useState(() => loadState('hfp_messages', defaultMessages));

  useEffect(() => {
    localStorage.setItem('hfp_messages', JSON.stringify(messages));
  }, [messages]);

  const sendMessage = (message) => {
    const newMessage = {
      id: Date.now(),
      date: new Date().toISOString(),
      read: false,
      ...message
    };
    setMessages([newMessage, ...messages]);
  };

  const markMessageAsRead = (id) => {
    setMessages(messages.map(msg => msg.id === id ? { ...msg, read: true } : msg));
  };

  const getMessagesForUser = (userId) => {
    return messages.filter(msg => msg.toUserId === userId);
  };

  return (
    <DataContext.Provider value={{
      posts, addPost, updatePostStatus, updatePost, deletePost,
      donationRequests, toggleDonationStatus, addDonationRequest, updateDonationRequest, deleteDonationRequest,
      events, addEvent, updateEvent, deleteEvent, toggleEventAttendance,
      organizations, addOrganization, updateOrganization, deleteOrganization,
      messages, sendMessage, markMessageAsRead, getMessagesForUser
    }}>
      {children}
    </DataContext.Provider>
  );
}
