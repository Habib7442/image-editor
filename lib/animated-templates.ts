// Animated templates for social media platforms using GSAP animations

export interface AnimatedTemplate {
  id: string;
  name: string;
  platform: 'instagram' | 'snapchat' | 'tiktok' | 'facebook';
  type: 'story' | 'post' | 'reel';
  duration: number; // in seconds
  aspectRatio: '9:16' | '1:1' | '4:5' | '16:9';
  thumbnail: string;
  description: string;
  effects: string[];
  animation: string; // GSAP animation type
  isPremium?: boolean;
  isNew?: boolean;
  href?: string;
}

export const ANIMATED_TEMPLATES: AnimatedTemplate[] = [
  {
    id: 'insta-story-zoom',
    name: 'Zoom Reveal',
    platform: 'instagram',
    type: 'story',
    duration: 15,
    aspectRatio: '9:16',
    thumbnail: '/post-template-1.jpg', // Using existing image
    description: 'Smooth zoom-in effect with text reveal, perfect for product showcases',
    effects: ['zoom', 'text-reveal', 'color-shift'],
    animation: 'zoom-in',
    isNew: true,
    href: '/templates/editor/animated/insta-story-zoom'
  },
];

// Animation presets using GSAP
export const ANIMATION_PRESETS = {
  'zoom-in': `
    gsap.timeline()
      .from('.image-container', { scale: 0.5, opacity: 0, duration: 1.5, ease: 'power2.out' })
      .from('.text-overlay', { y: 50, opacity: 0, duration: 1, ease: 'back.out(1.7)' }, '-=0.5')
  `,
  'slide-horizontal': `
    gsap.timeline({ repeat: -1 })
      .to('.slide-container', { x: '-100%', duration: 1, ease: 'power1.inOut' })
      .to('.slide-container', { x: '-200%', duration: 1, ease: 'power1.inOut' }, '+=1.5')
      .to('.slide-container', { x: '-300%', duration: 1, ease: 'power1.inOut' }, '+=1.5')
      .to('.slide-container', { x: '0%', duration: 0.1, ease: 'none' })
  `,
  'particle-explosion': `
    gsap.timeline()
      .from('.particle', { 
        scale: 0, 
        opacity: 0, 
        x: 'random(-100, 100)', 
        y: 'random(-100, 100)', 
        rotation: 'random(-180, 180)', 
        duration: 2, 
        stagger: 0.02, 
        ease: 'expo.out' 
      })
  `,
  'beat-match': `
    // This animation would be synchronized with audio beats
    gsap.timeline({ repeat: -1 })
      .to('.beat-element', { scale: 1.1, duration: 0.1, ease: 'power4.out' })
      .to('.beat-element', { scale: 1, duration: 0.2, ease: 'power4.in' })
      .to('.color-overlay', { opacity: 0.7, duration: 0.1, ease: 'none' }, '-=0.3')
      .to('.color-overlay', { opacity: 0, duration: 0.2, ease: 'none' })
  `,
  '3d-perspective': `
    gsap.timeline()
      .from('.text-3d', { 
        z: -500, 
        rotationY: 90, 
        opacity: 0, 
        transformOrigin: 'center center', 
        duration: 1.5, 
        stagger: 0.1, 
        ease: 'back.out(1.7)' 
      })
  `,
  'glitch-transition': `
    gsap.timeline()
      .to('.glitch-element', { 
        clipPath: 'polygon(0 10%, 100% 0%, 100% 90%, 0% 100%)', 
        x: 'random(-10, 10)', 
        duration: 0.1, 
        ease: 'steps(1)', 
        repeat: 10, 
        repeatRefresh: true 
      })
      .to('.rgb-split-r', { x: 5, duration: 0.2, ease: 'steps(2)' }, 0)
      .to('.rgb-split-g', { x: -3, y: 2, duration: 0.2, ease: 'steps(2)' }, 0)
      .to('.rgb-split-b', { x: -5, duration: 0.2, ease: 'steps(2)' }, 0)
      .to('.glitch-element, .rgb-split-r, .rgb-split-g, .rgb-split-b', { 
        clearProps: 'all', 
        duration: 0.1 
      })
  `,
  'kinetic-text': `
    gsap.timeline()
      .from('.kinetic-char', { 
        opacity: 0, 
        scale: 0, 
        y: 'random(-100, 100)', 
        rotationZ: 'random(-90, 90)', 
        duration: 1, 
        stagger: 0.03, 
        ease: 'back.out(3)' 
      })
      .to('.kinetic-char', { 
        y: 'random(-20, 20)', 
        rotationZ: 'random(-15, 15)', 
        duration: 2, 
        repeat: -1, 
        yoyo: true, 
        ease: 'sine.inOut', 
        stagger: { 
          each: 0.03, 
          from: 'random' 
        } 
      }, '-=0.5')
  `,
  'parallax-scroll': `
    gsap.timeline()
      .to('.parallax-layer-1', { y: -50, duration: 1, ease: 'none' }, 0)
      .to('.parallax-layer-2', { y: -100, duration: 1, ease: 'none' }, 0)
      .to('.parallax-layer-3', { y: -150, duration: 1, ease: 'none' }, 0)
  `
};
