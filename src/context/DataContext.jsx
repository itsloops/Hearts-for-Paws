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
  const defaultPosts = [];

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

  // --- Adoptable Pets State (New) ---
  const defaultAdoptablePets = [
    {
      id: 'pet1',
      name: 'Luna',
      breed: 'Labrador Mix',
      age: '2 years',
      gender: 'Female',
      status: 'Available for Adoption', 
      description: 'Luna is a sweet, energetic girl who loves fetch and belly rubs. She is great with kids and other dogs.',
      image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1000',
      organizationId: 'org1',
      goodWithKids: true,
      goodWithDogs: true,
      goodWithCats: false
    },
    {
      id: 'pet2',
      name: 'Oliver',
      breed: 'Tabby Cat',
      age: '4 years',
      gender: 'Male',
      status: 'In Foster Care',
      description: 'Oliver is a chill lap cat who loves sunbathing. Currently in a foster home and ready for his forever family.',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=1000',
      organizationId: 'org1',
      goodWithKids: true,
      goodWithDogs: false,
      goodWithCats: true
    },
    {
      id: 'pet3',
      name: 'Max',
      breed: 'Golden Retriever',
      age: '5 years',
      gender: 'Male',
      status: 'Available for Adoption',
      description: 'Max is the perfect family dog. He is gentle, well-trained, and loves everyone he meets.',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=1000',
      organizationId: 'org1',
      goodWithKids: true,
      goodWithDogs: true,
      goodWithCats: true
    }
  ];

  const [adoptablePets, setAdoptablePets] = useState(() => loadState('hfp_adoptable_pets', defaultAdoptablePets));

  useEffect(() => {
    localStorage.setItem('hfp_adoptable_pets', JSON.stringify(adoptablePets));
  }, [adoptablePets]);

  // --- Pet of the Month State ---
  // Store the full object to allow custom edits
  // IMPORTANT: Since we don't have a backend database, we must set a DEFAULT here for it to appear on the live site for all users.
  // Edit the object below to change the global "Pet of the Month".
  const defaultPetOfTheMonth = {
    id: 'default-pom',
    name: 'Stormi',
    breed: 'Weimaraner Mix',
    age: '1 year',
    gender: 'Female',
    status: 'Adopted', 
    description: 'Stormi is a calm loving dog who was recently adopted from the Rancho Cucamonga Animal Center in California. She loves her bone, new home, dog cousins and her PAWrents very much.',
    image: '/images/Stormi.JPG',
    goodWithKids: true,
    goodWithDogs: true,
    goodWithCats: true
  };

  const [petOfTheMonthData, setPetOfTheMonthData] = useState(() => loadState('hfp_pet_of_month_data', defaultPetOfTheMonth));

  useEffect(() => {
    if (petOfTheMonthData) {
        localStorage.setItem('hfp_pet_of_month_data', JSON.stringify(petOfTheMonthData));
    }
  }, [petOfTheMonthData]);

  // --- Messaging State ---
  const defaultMessages = [];

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
      adoptablePets, setAdoptablePets,
      petOfTheMonthData, setPetOfTheMonthData,
      messages, sendMessage, markMessageAsRead, getMessagesForUser
    }}>
      {children}
    </DataContext.Provider>
  );
}
