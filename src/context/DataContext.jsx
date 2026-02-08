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
      return saved ? JSON.parse(saved) : defaultValue;
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

  const [posts, setPosts] = useState(() => loadState('hfp_posts', defaultPosts));

  useEffect(() => {
    localStorage.setItem('hfp_posts', JSON.stringify(posts));
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
  const defaultDonations = [
    {
      id: 1,
      rescueName: 'Golden Hearts Retriever Rescue',
      item: 'Large Breed Puppy Food',
      quantity: '5 Bags',
      urgency: 'High',
      description: 'We have a new litter of 8 puppies and are running low on food!',
      fulfilled: false,
      userId: '999'
    },
    {
      id: 2,
      rescueName: 'Feline Friends Network',
      item: 'Clumping Cat Litter',
      quantity: '10 Boxes',
      urgency: 'Medium',
      description: 'Standard unscented clumping litter needed for our foster homes.',
      fulfilled: false,
      userId: '999'
    },
    {
      id: 3,
      rescueName: 'Bully Breed Rescue Squad',
      item: 'Heavy Duty Chew Toys',
      quantity: '15 Toys',
      urgency: 'Low',
      description: 'Kong toys or similar durable rubber toys for our strong chewers.',
      fulfilled: false,
      userId: '999'
    },
    {
      id: 4,
      rescueName: 'Little Paws Small Dog Rescue',
      item: 'Fleece Blankets',
      quantity: '20 Blankets',
      urgency: 'High',
      description: 'Winter is coming and we need small fleece blankets for crates.',
      fulfilled: false,
      userId: '999'
    },
    {
      id: 5,
      rescueName: 'Second Chance German Shepherds',
      item: 'Glucosamine Supplements',
      quantity: '10 Bottles',
      urgency: 'Medium',
      description: 'Joint supplements for our senior shepherds.',
      fulfilled: false,
      userId: '999'
    }
  ];

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

  const [events, setEvents] = useState(() => loadState('hfp_events', defaultEvents));

  useEffect(() => {
    localStorage.setItem('hfp_events', JSON.stringify(events));
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

  // --- Rescues & Fosters State ---
  const defaultOrgs = [
    {
      id: 1,
      name: 'Golden Hearts Retriever Rescue',
      category: 'Rescue',
      specialty: 'Golden Retrievers',
      phone: '(555) 123-4567',
      email: 'contact@goldenhearts.org',
      website: 'https://example.com/golden-hearts',
      address: '123 Golden Way, Springfield, IL',
      donationLink: 'https://example.com/donate/golden',
      image: null,
      description: 'Dedicated to finding loving homes for Golden Retrievers in need.',
      userId: 'admin'
    },
    {
      id: 2,
      name: 'Feline Friends Network',
      category: 'Rescue',
      specialty: 'Cats (All Breeds)',
      phone: '(555) 987-6543',
      email: 'adopt@felinefriends.net',
      website: 'https://example.com/feline-friends',
      address: '456 Whisker Lane, Shelbyville, IL',
      donationLink: 'https://example.com/donate/feline',
      image: null,
      description: 'A foster-based network helping abandoned and stray cats find forever homes.',
      userId: 'admin'
    },
    {
      id: 3,
      name: 'City Animal Shelter',
      category: 'Shelter',
      specialty: 'All Animals',
      phone: '(555) 111-2222',
      email: 'info@cityshelter.gov',
      website: 'https://example.com/city-shelter',
      address: '100 Municipal Dr, Springfield, IL',
      donationLink: 'https://example.com/donate/city-shelter',
      image: null,
      description: 'The official municipal animal shelter providing care and adoption services for lost and homeless pets.',
      userId: 'admin'
    },
    {
      id: 4,
      name: 'Bully Breed Rescue Squad',
      category: 'Rescue',
      specialty: 'Pit Bulls & Bully Breeds',
      phone: '(555) 456-7890',
      website: 'https://example.com/bully-squad',
      address: '789 Strong St, Capital City, IL',
      donationLink: 'https://example.com/donate/bully',
      image: null,
      description: 'Advocating for and rescuing misunderstood bully breeds.',
      userId: 'admin'
    },
    {
      id: 5,
      name: 'County Humane Society',
      category: 'Shelter',
      specialty: 'All Animals',
      phone: '(555) 333-4444',
      website: 'https://example.com/county-humane',
      address: '500 County Rd, Ruralville, IL',
      donationLink: 'https://example.com/donate/county',
      image: null,
      description: 'A non-profit shelter dedicated to the prevention of cruelty to animals.',
      userId: 'admin'
    },
    {
      id: 6,
      name: 'Little Paws Small Dog Rescue',
      category: 'Rescue',
      specialty: 'Small Breeds (Under 20lbs)',
      phone: '(555) 222-3333',
      website: 'https://example.com/little-paws',
      address: '321 Tiny Terrace, Springfield, IL',
      donationLink: 'https://example.com/donate/little',
      image: null,
      description: 'Big hearts for small dogs. We specialize in chihuahuas, yorkies, and more.',
      userId: 'admin'
    },
    {
      id: 7,
      name: 'Second Chance German Shepherds',
      category: 'Rescue',
      specialty: 'German Shepherds',
      phone: '(555) 777-8888',
      website: 'https://example.com/gsd-rescue',
      address: 'P.O. Box 555, Rural Route 1, IL',
      donationLink: 'https://example.com/donate/gsd',
      image: null,
      description: 'Rehabilitating and rehoming German Shepherds across the state.',
      userId: 'admin'
    }
  ];

  const [organizations, setOrganizations] = useState(() => loadState('hfp_orgs', defaultOrgs));

  useEffect(() => {
    localStorage.setItem('hfp_orgs', JSON.stringify(organizations));
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

  const value = {
    posts,
    addPost,
    updatePostStatus,
    updatePost,
    deletePost,
    donationRequests,
    toggleDonationStatus,
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    organizations,
    addOrganization,
    updateOrganization,
    deleteOrganization
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}
