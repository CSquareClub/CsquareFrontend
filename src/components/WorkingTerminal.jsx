import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const WorkingTerminal = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  // Initial welcome sequence
  const initialSequence = [
    'Welcome to C-Square Club Terminal',
    'Type "help" to see available commands',
    '─'.repeat(50)
  ];

  // File system structure
  const fileSystem = {
    '/': {
      'projects': {
        'web-development': ['react-app.js', 'vue-dashboard.js', 'next-portfolio.js'],
        'mobile-apps': ['flutter-chat.dart', 'react-native-game.js'],
        'cybersecurity': ['penetration-test.py', 'vulnerability-scanner.py']
      },
      'events': {
        'hackathons': ['2024-winter-hack.md', '2024-summer-code.md'],
        'workshops': ['react-basics.md', 'python-advanced.md', 'cybersec-101.md'],
        'competitions': ['coding-challenge.js', 'bug-bounty.md']
      },
      'team': {
        'developers': ['john-doe.json', 'jane-smith.json'],
        'designers': ['alex-wilson.json'],
        'mentors': ['dr-tech.json', 'prof-code.json']
      },
      'mission.txt': 'Coding - Creating - Collaborating\nBuilding the future, one line at a time...',
      'about.txt': 'C-Square Club: Computing & Cybersecurity Community\nFounded: 2024\nMembers: 150+\nProjects: 25+'
    }
  };

  const [currentPath, setCurrentPath] = useState('/');
  const [fileSystemRef] = useState(fileSystem);

  // Available commands
  const commands = {
    help: () => [
      'Available commands:',
      '',
      '📁 File System:',
      '  ls          - List directory contents',
      '  cd <dir>    - Change directory',
      '  cat <file>  - Display file contents',
      '  pwd         - Show current directory',
      '',
      '🔧 System:',
      '  clear       - Clear terminal',
      '  whoami      - Display current user',
      '  date        - Show current date',
      '',
      '🎯 C-Square Club:',
      '  about       - About C-Square Club',
      '  projects    - Show our projects',
      '  events      - Show upcoming events',
      '  join        - How to join us',
      '  contact     - Contact information',
      '',
      '🎮 Fun Commands:',
      '  matrix      - Enter the matrix',
      '  hack        - Try to hack (ethically!)',
      '  code        - Random code snippet',
      '  fortune     - Get a coding fortune',
      '',
      '� Secret Commands:',
      '  admin       - Access administrative portal',
      '',
      '�💡 Tip: Tab completion coming soon!'
    ],
    
    ls: (args) => {
      const path = args[0] || currentPath;
      const dir = getDirectory(path);
      if (!dir) return [`ls: ${path}: No such file or directory`];
      
      return Object.keys(dir).map(item => {
        const isDir = typeof dir[item] === 'object' && !Array.isArray(dir[item]);
        return isDir ? `📁 ${item}/` : `📄 ${item}`;
      });
    },
    
    pwd: () => [currentPath],
    
    cd: (args) => {
      if (!args[0]) return ['Usage: cd <directory>'];
      
      const newPath = resolvePath(args[0]);
      const dir = getDirectory(newPath);
      
      if (!dir) return [`cd: ${args[0]}: No such file or directory`];
      if (typeof dir !== 'object' || Array.isArray(dir)) {
        return [`cd: ${args[0]}: Not a directory`];
      }
      
      setCurrentPath(newPath);
      return [`Changed to ${newPath}`];
    },
    
    cat: (args) => {
      if (!args[0]) return ['Usage: cat <filename>'];
      
      const file = getFile(args[0]);
      if (file === null) return [`cat: ${args[0]}: No such file or directory`];
      if (typeof file === 'object') return [`cat: ${args[0]}: Is a directory`];
      
      return Array.isArray(file) ? file : [file];
    },
    
    clear: () => {
      setHistory([]);
      return [];
    },
    
    whoami: () => ['guest@c-square-club'],
    
    date: () => [new Date().toLocaleString()],
    
    about: () => [
      '🎯 C-Square Club - Computing & Cybersecurity Community',
      '',
      '📊 Stats:',
      '  • Founded: 2024',
      '  • Active Members: 150+',
      '  • Completed Projects: 25+',
      '  • Weekly Events: 3-5',
      '',
      '🚀 Mission: Coding - Creating - Collaborating',
      '💡 Vision: Building the future, one line at a time'
    ],
    
    projects: () => [
      '🔥 Active Projects:',
      '',
      '🌐 Web Development:',
      '  • Modern React Applications',
      '  • Vue.js Dashboards',
      '  • Next.js Portfolios',
      '',
      '📱 Mobile Development:',
      '  • Flutter Chat Applications',
      '  • React Native Games',
      '',
      '🔐 Cybersecurity:',
      '  • Penetration Testing Tools',
      '  • Vulnerability Scanners',
      '',
      'Want to contribute? Type "join" to learn how!'
    ],
    
    events: () => [
      '📅 Upcoming Events:',
      '',
      '🏆 Hackathons:',
      '  • Winter Code Challenge 2024',
      '  • Summer Innovation Hack',
      '',
      '🎯 Workshops:',
      '  • React Fundamentals',
      '  • Advanced Python',
      '  • Cybersecurity 101',
      '',
      '🏅 Competitions:',
      '  • Weekly Coding Challenges',
      '  • Bug Bounty Programs'
    ],
    
    join: () => [
      '🤝 How to Join C-Square Club:',
      '',
      '1. 📧 Contact us at: csquare@club.com',
      '2. 💬 Join our Discord: discord.gg/csquare',
      '3. 🌐 Visit our website events section',
      '4. 📍 Attend our weekly meetups',
      '',
      '🎯 What we offer:',
      '  • Hands-on coding experience',
      '  • Mentorship programs',
      '  • Industry connections',
      '  • Project collaboration',
      '',
      '💫 Ready to start your coding journey?'
    ],
    
    contact: () => [
      '📞 Contact Information:',
      '',
      '📧 Email: csquare@club.com',
      '🌐 Website: c-square-club.com',
      '💬 Discord: discord.gg/csquare',
      '📱 Twitter: @CSquareClub',
      '📍 Location: Tech Campus, Room 101',
      '',
      '⏰ Office Hours:',
      '  Monday-Friday: 2:00 PM - 6:00 PM',
      '  Saturday: 10:00 AM - 4:00 PM'
    ],

    // Fun easter egg commands
    matrix: () => {
      const chars = '01';
      const lines = [];
      for (let i = 0; i < 8; i++) {
        let line = '';
        for (let j = 0; j < 60; j++) {
          line += chars[Math.floor(Math.random() * chars.length)];
        }
        lines.push(line);
      }
      return [
        '🔴 ENTERING THE MATRIX...',
        ...lines,
        '🔴 MATRIX MODE ACTIVATED'
      ];
    },

    hack: () => [
      '🔐 INITIATING HACK SEQUENCE...',
      '📡 Scanning network... 25%',
      '🔍 Finding vulnerabilities... 50%',
      '💻 Bypassing firewall... 75%',
      '✅ ACCESS GRANTED! Welcome to C-Square Club! 😄',
      '',
      'Just kidding! We promote ethical hacking only! 🛡️'
    ],

    code: () => [
      '💻 Random Code Snippet:',
      '',
      'function buildTheFuture() {',
      '  const creativity = new Innovation();',
      '  const collaboration = teamwork.connect();',
      '  ',
      '  return creativity.merge(collaboration);',
      '}',
      '',
      'buildTheFuture(); // ✨ Magic happens here!'
    ],

    fortune: () => {
      const fortunes = [
        '🔮 "Code is poetry written for machines." - C-Square Wisdom',
        '🎯 "The best way to predict the future is to code it." - Tech Oracle',
        '🚀 "In coding we trust, in collaboration we excel." - Club Motto',
        '💡 "Every expert was once a beginner." - Motivation Bot',
        '🌟 "Debugging is twice as hard as writing the code." - Truth Teller'
      ];
      return [fortunes[Math.floor(Math.random() * fortunes.length)]];
    },

    admin: () => {
      setTimeout(() => {
        setHistory(prev => [...prev, 
          '',
          '🔒 ACCESSING ADMINISTRATIVE PORTAL...',
          '🔑 AUTHENTICATING...',
          '✨ WELCOME CHIEF! 🚀',
          '',
          '🌟 You have successfully entered the command center.',
          '⚡ Redirecting to admin dashboard...',
          ''
        ]);
        
        // Navigate to admin page after showing the welcome message
        setTimeout(() => {
          navigate('/admin');
        }, 2000);
      }, 500);
      
      return [
        '🔐 ADMIN ACCESS INITIATED...',
        '📡 Scanning authorization levels...',
        '🎯 Access granted!'
      ];
    }
  };

  // Helper functions
  const getDirectory = (path) => {
    const parts = path.split('/').filter(p => p);
    let current = fileSystemRef['/'];
    
    for (const part of parts) {
      if (current[part] && typeof current[part] === 'object' && !Array.isArray(current[part])) {
        current = current[part];
      } else {
        return null;
      }
    }
    return current;
  };

  const getFile = (filename) => {
    const dir = getDirectory(currentPath);
    if (!dir || !dir[filename]) return null;
    return dir[filename];
  };

  const resolvePath = (path) => {
    if (path.startsWith('/')) return path;
    if (path === '..') {
      const parts = currentPath.split('/').filter(p => p);
      parts.pop();
      return '/' + parts.join('/');
    }
    if (path === '.') return currentPath;
    
    const parts = currentPath.split('/').filter(p => p);
    parts.push(path);
    return '/' + parts.join('/');
  };

  const executeCommand = (input) => {
    const parts = input.trim().split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (commands[command]) {
      return commands[command](args);
    } else if (command === '') {
      return [];
    } else {
      return [`Command not found: ${command}. Type 'help' for available commands.`];
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentInput.trim()) return;

    const prompt = `guest@c-square-club:${currentPath}$ ${currentInput}`;
    const output = executeCommand(currentInput);

    setHistory(prev => [
      ...prev,
      { type: 'input', text: prompt },
      ...output.map(line => ({ type: 'output', text: line }))
    ]);

    // Add to command history
    setCommandHistory(prev => [...prev, currentInput]);
    setHistoryIndex(-1);
    setCurrentInput('');
    
    // Scroll to bottom
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }, 10);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex + 1;
        if (newIndex < commandHistory.length) {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Basic tab completion for commands
      const available = Object.keys(commands).filter(cmd => 
        cmd.startsWith(currentInput.toLowerCase())
      );
      if (available.length === 1) {
        setCurrentInput(available[0]);
      }
    }
  };

  const handleTerminalClick = () => {
    setIsActive(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Initialize terminal with welcome message
  useEffect(() => {
    const timer = setTimeout(() => {
      setHistory(initialSequence.map(line => ({ type: 'output', text: line })));
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Cursor blinking effect
  useEffect(() => {
    const timer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(timer);
  }, []);

  // Auto-focus when terminal becomes active
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.7 }}
      className="working-terminal"
      style={{
        width: 'clamp(320px, 90vw, 700px)',
        height: 'clamp(300px, 50vh, 420px)',
        backgroundColor: '#000000',
        borderRadius: 'clamp(12px, 3vw, 18px)',
        border: '3px solid #00ffff',
        boxShadow: `
          0 0 30px rgba(0, 255, 255, 0.5),
          0 0 60px rgba(0, 255, 255, 0.3),
          inset 0 0 20px rgba(0, 0, 0, 0.8)
        `,
        overflow: 'hidden',
        position: 'relative',
        cursor: 'text'
      }}
      onClick={handleTerminalClick}
    >
      {/* Terminal Header */}
      <div 
        className="terminal-header"
        style={{
          height: 'clamp(30px, 8vw, 40px)',
          background: 'linear-gradient(90deg, #1a1a1a, #2a2a2a)',
          borderBottom: '2px solid #00ffff',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 'clamp(8px, 3vw, 16px)',
          gap: 'clamp(4px, 2vw, 8px)'
        }}
      >
        <div style={{ width: 'clamp(8px, 3vw, 12px)', height: 'clamp(8px, 3vw, 12px)', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
        <div style={{ width: 'clamp(8px, 3vw, 12px)', height: 'clamp(8px, 3vw, 12px)', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
        <div style={{ width: 'clamp(8px, 3vw, 12px)', height: 'clamp(8px, 3vw, 12px)', borderRadius: '50%', backgroundColor: '#27ca3f' }} />
        <span style={{ marginLeft: 'clamp(8px, 3vw, 16px)', color: '#00ffff', fontSize: 'clamp(10px, 2.5vw, 14px)', fontFamily: 'monospace' }}>
          terminal@c-square-club
        </span>
        {!isActive && (
          <span style={{ marginLeft: 'auto', marginRight: 'clamp(8px, 3vw, 16px)', color: '#888', fontSize: 'clamp(8px, 2vw, 12px)', display: window.innerWidth > 480 ? 'block' : 'none' }}>
            Click to interact →
          </span>
        )}
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="terminal-content"
        style={{
          padding: 'clamp(10px, 4vw, 20px)',
          height: 'calc(100% - clamp(30px, 8vw, 40px))',
          fontFamily: 'Consolas, Monaco, monospace',
          fontSize: 'clamp(10px, 2.5vw, 14px)',
          lineHeight: '1.4',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        {/* History */}
        {history.map((line, index) => (
          <div 
            key={index}
            style={{
              color: line.type === 'input' ? '#00ffff' : '#00ff41',
              marginBottom: '4px',
              wordWrap: 'break-word'
            }}
          >
            {line.text}
          </div>
        ))}

        {/* Current Input Line */}
        {isActive && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ color: '#00ffff', marginRight: '8px', fontSize: 'clamp(10px, 2.5vw, 14px)' }}>
              guest@c-square-club:{currentPath}$
            </span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#00ff41',
                fontFamily: 'Consolas, Monaco, monospace',
                fontSize: 'clamp(10px, 2.5vw, 14px)',
                flex: 1,
                minWidth: '100px'
              }}
              autoComplete="off"
              spellCheck="false"
            />
            <span style={{ 
              color: '#00ff41', 
              fontSize: 'clamp(10px, 2.5vw, 14px)',
              opacity: showCursor ? 1 : 0,
              transition: 'opacity 0.1s'
            }}>
              █
            </span>
          </form>
        )}

        {/* Inactive state message */}
        {!isActive && (
          <div style={{ color: '#888', fontStyle: 'italic', marginTop: '20px' }}>
            <div style={{ marginBottom: '10px' }}>
              Click anywhere on the terminal to start typing commands...
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              🎯 Try: help, ls, about, projects, events, matrix, hack
              <br />
              🚀 Features: Arrow keys for history, Tab for completion
            </div>
          </div>
        )}
      </div>

      {/* Glow effect */}
      <div 
        className="terminal-glow"
        style={{
          position: 'absolute',
          inset: '-5px',
          background: 'linear-gradient(45deg, rgba(0, 255, 255, 0.2), rgba(0, 255, 255, 0.1))',
          borderRadius: '23px',
          zIndex: -1,
          filter: 'blur(10px)',
          opacity: isActive ? 1 : 0.5,
          transition: 'opacity 0.3s ease'
        }}
      />

      <style jsx="true">{`
        .terminal-content::-webkit-scrollbar {
          width: 8px;
        }
        .terminal-content::-webkit-scrollbar-track {
          background: #1a1a1a;
        }
        .terminal-content::-webkit-scrollbar-thumb {
          background: #00ffff;
          border-radius: 4px;
        }
        .terminal-content::-webkit-scrollbar-thumb:hover {
          background: #00cccc;
        }
      `}</style>
    </motion.div>
  );
};

export default WorkingTerminal;
