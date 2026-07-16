export const technicalAssessmentQuestions = [
  // ─── SEGMENT 1: API DEVELOPMENT (ApiDev) ───
  {
    questionId: 101,
    section: "technical",
    questionText: "Which HTTP method is designed to be idempotent and is primarily used to replace an existing resource or create it if it does not exist?",
    competencyTag: "API Development",
    options: [
      { code: "A", title: "POST", description: "Creates a new resource; not idempotent." },
      { code: "B", title: "PUT", description: "Replaces or creates a resource; idempotent." },
      { code: "C", title: "PATCH", description: "Applies partial modifications to a resource." },
      { code: "D", title: "DELETE", description: "Removes the resource." }
    ],
    correctAnswer: "B"
  },
  {
    questionId: 102,
    section: "technical",
    questionText: "In RESTful API design, which HTTP status code should be returned when a resource is successfully created?",
    competencyTag: "API Development",
    options: [
      { code: "A", title: "200 OK", description: "Standard response for successful HTTP requests." },
      { code: "B", title: "201 Created", description: "The request has been fulfilled and resulted in a new resource." },
      { code: "C", title: "202 Accepted", description: "The request has been accepted for processing, but is not complete." },
      { code: "D", title: "204 No Content", description: "The server successfully processed the request but returns no content." }
    ],
    correctAnswer: "B"
  },
  {
    questionId: 103,
    section: "technical",
    questionText: "What is the primary purpose of CORS (Cross-Origin Resource Sharing) in web APIs?",
    competencyTag: "API Development",
    options: [
      { code: "A", title: "To encrypt API traffic", description: "Secures data in transit using SSL/TLS." },
      { code: "B", title: "To compress responses", description: "Reduces response payload sizes for performance." },
      { code: "C", title: "To permit/restrict cross-origin requests", description: "Allows browser clients on one origin to access resources on a different origin." },
      { code: "D", title: "To load balance traffic", description: "Distributes requests across multiple servers." }
    ],
    correctAnswer: "C"
  },
  {
    questionId: 104,
    section: "technical",
    questionText: "What does the HTTP status code '429 Too Many Requests' indicate?",
    competencyTag: "API Development",
    options: [
      { code: "A", title: "Authentication missing", description: "The user has not provided valid credentials." },
      { code: "B", title: "Resource not found", description: "The server cannot find the requested URL." },
      { code: "C", title: "Rate limiting active", description: "The client has sent too many requests in a given amount of time." },
      { code: "D", title: "Payload too large", description: "The request payload size exceeds the server's limit." }
    ],
    correctAnswer: "C"
  },
  {
    questionId: 105,
    section: "technical",
    questionText: "Which specification is widely used to describe, document, and visualize RESTful APIs in a machine-readable format?",
    competencyTag: "API Development",
    options: [
      { code: "A", title: "GraphQL", description: "A query language for APIs and runtime." },
      { code: "B", title: "OpenAPI (Swagger)", description: "Standard specification for documenting RESTful APIs." },
      { code: "C", title: "SOAP WSDL", description: "XML-based description language for SOAP services." },
      { code: "D", title: "JSON Schema", description: "A vocabulary that allows you to annotate and validate JSON documents." }
    ],
    correctAnswer: "B"
  },

  // ─── SEGMENT 2: DATABASE MANAGEMENT SYSTEMS (DBMS) ───
  {
    questionId: 106,
    section: "technical",
    questionText: "Which database normal form ensures that there are no partial dependencies on a composite primary key?",
    competencyTag: "Database Management Systems",
    options: [
      { code: "A", title: "First Normal Form (1NF)", description: "Eliminates duplicate columns and groups." },
      { code: "B", title: "Second Normal Form (2NF)", description: "Requires 1NF and no partial dependencies on primary key." },
      { code: "C", title: "Third Normal Form (3NF)", description: "Requires 2NF and no transitive dependencies." },
      { code: "D", title: "Boyce-Codd Normal Form (BCNF)", description: "A stronger version of 3NF." }
    ],
    correctAnswer: "B"
  },
  {
    questionId: 107,
    section: "technical",
    questionText: "What property of ACID transactions ensures that database operations are committed completely or not at all?",
    competencyTag: "Database Management Systems",
    options: [
      { code: "A", title: "Atomicity", description: "Ensures all operations succeed or all fail together." },
      { code: "B", title: "Consistency", description: "Ensures database transitions from one valid state to another." },
      { code: "C", title: "Isolation", description: "Ensures concurrent transactions execute independently." },
      { code: "D", title: "Durability", description: "Ensures completed transaction updates survive crashes." }
    ],
    correctAnswer: "A"
  },
  {
    questionId: 108,
    section: "technical",
    questionText: "What type of index should be created on a database column to allow fast range queries and matches, while maintaining sorted order?",
    competencyTag: "Database Management Systems",
    options: [
      { code: "A", title: "Hash Index", description: "Optimized only for exact equality lookups." },
      { code: "B", title: "B-Tree Index", description: "Self-balancing tree index optimized for range and sorted queries." },
      { code: "C", title: "GIN Index", description: "Generalized Inverted Index for multi-value items." },
      { code: "D", title: "Full-Text Index", description: "Optimized for word searches inside text blocks." }
    ],
    correctAnswer: "B"
  },
  {
    questionId: 109,
    section: "technical",
    questionText: "In SQL, what is the key difference between a WHERE clause and a HAVING clause?",
    competencyTag: "Database Management Systems",
    options: [
      { code: "A", title: "WHERE filters rows; HAVING filters aggregates", description: "WHERE filters before GROUP BY; HAVING filters after." },
      { code: "B", title: "WHERE is for subqueries only", description: "HAVING is for main queries only." },
      { code: "C", title: "WHERE requires indexes", description: "HAVING is computed entirely in memory." },
      { code: "D", title: "No difference", description: "They are completely interchangeable syntactically." }
    ],
    correctAnswer: "A"
  },
  {
    questionId: 110,
    section: "technical",
    questionText: "Which of the following is a primary characteristic of document-oriented NoSQL databases like MongoDB?",
    competencyTag: "Database Management Systems",
    options: [
      { code: "A", title: "Enforced strict relational schema", description: "Requires pre-defined table and column structures." },
      { code: "B", title: "Semi-structured JSON-like storage", description: "Stores data in flexible BSON/JSON documents without rigid schemas." },
      { code: "C", title: "Graph-based relations", description: "Uses nodes, properties, and edges for storage." },
      { code: "D", title: "Column-family storage", description: "Optimized for querying large amounts of data by columns." }
    ],
    correctAnswer: "B"
  },

  // ─── SEGMENT 3: DATA SCIENCE & ANALYTICS (DataScience) ───
  {
    questionId: 111,
    section: "technical",
    questionText: "In machine learning, what does the term 'Overfitting' mean?",
    competencyTag: "Data Science & Analytics",
    options: [
      { code: "A", title: "Poor training, good testing performance", description: "The model fails to learn patterns during training." },
      { code: "B", title: "Good training, poor testing performance", description: "The model memorizes training noise and fails to generalize." },
      { code: "C", title: "Model under-parameterization", description: "The model has too few parameters to fit the data." },
      { code: "D", title: "Early training termination", description: "Training finishes before minimizing error." }
    ],
    correctAnswer: "B"
  },
  {
    questionId: 112,
    section: "technical",
    questionText: "Which evaluation metric is most appropriate for a highly imbalanced classification dataset (e.g., fraud detection)?",
    competencyTag: "Data Science & Analytics",
    options: [
      { code: "A", title: "Accuracy", description: "Can be misleadingly high by just predicting the majority class." },
      { code: "B", title: "F1-Score / PR-AUC", description: "Balances precision and recall to measure performance on the minority class." },
      { code: "C", title: "Mean Squared Error (MSE)", description: "Evaluation metric for regression tasks." },
      { code: "D", title: "R-squared (R²)", description: "Indicates proportion of variance explained in regression." }
    ],
    correctAnswer: "B"
  },
  {
    questionId: 113,
    section: "technical",
    questionText: "What is the main purpose of dimensionality reduction techniques like Principal Component Analysis (PCA)?",
    competencyTag: "Data Science & Analytics",
    options: [
      { code: "A", title: "To increase training sample counts", description: "Synthesizes or collects more data points." },
      { code: "B", title: "To reduce feature dimensions while retaining variance", description: "Projects high-dimensional data onto lower-dimensional coordinates." },
      { code: "C", title: "To classify data points", description: "Predicts discrete target variables." },
      { code: "D", title: "To fill missing database fields", description: "Imputes values using statistical modes." }
    ],
    correctAnswer: "B"
  },
  {
    questionId: 114,
    section: "technical",
    questionText: "In statistics and data analysis, what does a correlation coefficient of -0.85 indicate?",
    competencyTag: "Data Science & Analytics",
    options: [
      { code: "A", title: "No statistical relationship", description: "Indicated by a value close to 0." },
      { code: "B", title: "Weak negative relationship", description: "Typically values between -0.1 and -0.3." },
      { code: "C", title: "Strong negative linear relationship", description: "Strong inverse movement between the two variables." },
      { code: "D", title: "Strong positive linear relationship", description: "Strong direct movement between the two variables." }
    ],
    correctAnswer: "C"
  },
  {
    questionId: 115,
    section: "technical",
    questionText: "Which of the following algorithms is an example of an unsupervised learning method used for clustering?",
    competencyTag: "Data Science & Analytics",
    options: [
      { code: "A", title: "Linear Regression", description: "Supervised method for regression." },
      { code: "B", title: "K-Means Clustering", description: "Unsupervised method that groups data into K distinct clusters." },
      { code: "C", title: "Support Vector Machines (SVM)", description: "Supervised method for classification." },
      { code: "D", title: "Decision Trees", description: "Supervised hierarchical classification/regression method." }
    ],
    correctAnswer: "B"
  },

  // ─── SEGMENT 4: FRONTEND WEB DEVELOPMENT (WebDev) ───
  {
    questionId: 116,
    section: "technical",
    questionText: "What is the Virtual DOM in frameworks like React?",
    competencyTag: "Frontend Web Development",
    options: [
      { code: "A", title: "A replica of the DOM in the cloud", description: "A remote backup copy of site layouts." },
      { code: "B", title: "A lightweight in-memory DOM representation", description: "Allows computing layout updates and updates only changed elements." },
      { code: "C", title: "A debugging extension", description: "A browser add-on to debug layout errors." },
      { code: "D", title: "A CSS compiling tool", description: "Transpiles styles into browser-readable JS." }
    ],
    correctAnswer: "B"
  },
  {
    questionId: 117,
    section: "technical",
    questionText: "In modern CSS design, what is the primary structural difference between Flexbox and CSS Grid?",
    competencyTag: "Frontend Web Development",
    options: [
      { code: "A", title: "Flexbox is 1D; CSS Grid is 2D", description: "Flexbox aligns content in one dimension; Grid aligns in rows and columns." },
      { code: "B", title: "Flexbox is only for mobile layouts", description: "Grid is designed solely for desktop screens." },
      { code: "C", title: "Flexbox does not support gaps", description: "Gaps are exclusive to grid containers." },
      { code: "D", title: "Grid is obsolete", description: "Modern standards recommend avoiding CSS Grid." }
    ],
    correctAnswer: "A"
  },
  {
    questionId: 118,
    section: "technical",
    questionText: "What is the purpose of the return cleanup function inside a React useEffect hook?",
    competencyTag: "Frontend Web Development",
    options: [
      { code: "A", title: "To reset component state variables", description: "Clears state fields on re-render." },
      { code: "B", title: "To clean up subscriptions and event listeners", description: "Prevents memory leaks when components unmount or parameters change." },
      { code: "C", title: "To trigger a force re-render", description: "Instructs React to immediately redraw." },
      { code: "D", title: "To delete backend temporary files", description: "Frees server disk space." }
    ],
    correctAnswer: "B"
  },
  {
    questionId: 119,
    section: "technical",
    questionText: "What does the 'Critical Rendering Path' refer to in frontend performance engineering?",
    competencyTag: "Frontend Web Development",
    options: [
      { code: "A", title: "Server network request routing path", description: "The path of database operations on the backend." },
      { code: "B", title: "Steps to convert code into pixels", description: "The browser parsing HTML, CSS, and JS to paint the page." },
      { code: "C", title: "API authentication process", description: "Security layers for API request verification." },
      { code: "D", title: "React directory structure", description: "The standard hierarchy of page folders." }
    ],
    correctAnswer: "B"
  },
  {
    questionId: 120,
    section: "technical",
    questionText: "Which Web API allows developers to store key-value data persistently in the browser with no expiration?",
    competencyTag: "Frontend Web Development",
    options: [
      { code: "A", title: "SessionStorage", description: "Stores data that is wiped when the browser tab closes." },
      { code: "B", title: "LocalStorage", description: "Persistent storage that survives browser restarts and has no expiry." },
      { code: "C", title: "HTTP Cookies", description: "Small tokens sent back and forth to servers; have expiry limits." },
      { code: "D", title: "IndexedDB", description: "A transactional database for structured, complex data." }
    ],
    correctAnswer: "B"
  },

  // ─── SEGMENT 5: CLOUD COMPUTING & DEVOPS (Cloud) ───
  {
    questionId: 121,
    section: "technical",
    questionText: "What is the core difference between horizontal scaling and vertical scaling?",
    competencyTag: "Cloud Computing & DevOps",
    options: [
      { code: "A", title: "Horizontal adds resources to one machine", description: "Vertical adds more instances of machines." },
      { code: "B", title: "Horizontal adds more machines; Vertical adds resources", description: "Horizontal spins up new instances; Vertical adds CPU/RAM to current server." },
      { code: "C", title: "Horizontal is databases only", description: "Vertical is exclusive to stateless servers." },
      { code: "D", title: "Horizontal is manual scaling", description: "Vertical scaling requires server reboots." }
    ],
    correctAnswer: "B"
  },
  {
    questionId: 122,
    section: "technical",
    questionText: "In Docker containerization, what is the purpose of a 'Dockerfile'?",
    competencyTag: "Cloud Computing & DevOps",
    options: [
      { code: "A", title: "To encrypt database tables", description: "A text file holding encryption keys." },
      { code: "B", title: "To define container image blueprints", description: "A text script containing instructions to assemble a Docker image." },
      { code: "C", title: "To run performance monitors", description: "A script analyzing container hardware usage." },
      { code: "D", title: "To manage folder backups", description: "Controls data volume synchronization." }
    ],
    correctAnswer: "B"
  },
  {
    questionId: 123,
    section: "technical",
    questionText: "What does CI/CD represent in modern dev and deployment pipelines?",
    competencyTag: "Cloud Computing & DevOps",
    options: [
      { code: "A", title: "Cloud Integration / Central Deployment", description: "Integrates applications directly onto cloud servers." },
      { code: "B", title: "Continuous Integration / Continuous Deployment", description: "Automates testing, integration, and deployment of code changes." },
      { code: "C", title: "Container Integration / Cloud Delivery", description: "Manages container uploads to registries." },
      { code: "D", title: "Centralized Infrastructure / Core Development", description: "A project management framework." }
    ],
    correctAnswer: "B"
  },
  {
    questionId: 124,
    section: "technical",
    questionText: "What is the primary benefit of Infrastructure as Code (IaC) tools like Terraform?",
    competencyTag: "Cloud Computing & DevOps",
    options: [
      { code: "A", title: "Automating application coding", description: "Generates backend logic using AI models." },
      { code: "B", title: "Declarative infrastructure provisioning", description: "Defines and manages infrastructure resources using files instead of clicking UI." },
      { code: "C", title: "Inspecting browser console logs", description: "Tracks frontend runtime exceptions." },
      { code: "D", title: "Database sharding", description: "Splits database tables across clusters." }
    ],
    correctAnswer: "B"
  },
  {
    questionId: 125,
    section: "technical",
    questionText: "Which cloud service model provides virtual servers and storage, giving users maximum control over the operating system?",
    competencyTag: "Cloud Computing & DevOps",
    options: [
      { code: "A", title: "SaaS (Software as a Service)", description: "Accessing final applications over the web." },
      { code: "B", title: "PaaS (Platform as a Service)", description: "Managed deployment platform where OS is managed by the provider." },
      { code: "C", title: "IaaS (Infrastructure as a Service)", description: "Virtualized hardware, leaving OS and middleware control to the user." },
      { code: "D", title: "FaaS (Function as a Service)", description: "Serverless execution of modular pieces of code." }
    ],
    correctAnswer: "C"
  },

  // ─── SEGMENT 6: DATA STRUCTURES & ALGORITHMS (DSA) ───
  {
    questionId: 126,
    section: "technical",
    questionText: "What is the worst-case time complexity of searching for an element in a balanced Binary Search Tree (BST) of size N?",
    competencyTag: "Data Structures & Algorithms",
    options: [
      { code: "A", title: "O(1)", description: "Constant lookup time." },
      { code: "B", title: "O(log N)", description: "Logarithmic time, splitting search space in half at each node." },
      { code: "C", title: "O(N)", description: "Linear time, traversing all nodes." },
      { code: "D", title: "O(N log N)", description: "Typical complexity of efficient sorting." }
    ],
    correctAnswer: "B"
  },
  {
    questionId: 127,
    section: "technical",
    questionText: "Which data structure operates on the Last-In, First-Out (LIFO) access principle?",
    competencyTag: "Data Structures & Algorithms",
    options: [
      { code: "A", title: "Queue", description: "Operates on First-In, First-Out (FIFO)." },
      { code: "B", title: "Stack", description: "Operates on Last-In, First-Out (LIFO) for push/pop operations." },
      { code: "C", title: "Hash Map", description: "Provides associative key-value lookups." },
      { code: "D", title: "Linked List", description: "A sequence of nodes with references to next elements." }
    ],
    correctAnswer: "B"
  },
  {
    questionId: 128,
    section: "technical",
    questionText: "Which sorting algorithm has a guaranteed worst-case time complexity of O(N log N) and uses a divide-and-conquer strategy?",
    competencyTag: "Data Structures & Algorithms",
    options: [
      { code: "A", title: "Quick Sort", description: "Divide-and-conquer, but has a worst-case of O(N²) on sorted arrays." },
      { code: "B", title: "Bubble Sort", description: "Simple comparison sort with worst-case of O(N²)." },
      { code: "C", title: "Insertion Sort", description: "Builds sorted array one item at a time; worst-case O(N²)." },
      { code: "D", title: "Merge Sort", description: "Divides list, sorts sublists recursively, merges them; guaranteed O(N log N)." }
    ],
    correctAnswer: "D"
  },
  {
    questionId: 129,
    section: "technical",
    questionText: "What is the primary advantage of a Hash Map / Hash Table over a standard Linked List?",
    competencyTag: "Data Structures & Algorithms",
    options: [
      { code: "A", title: "It maintains element insertion order", description: "Linked Lists naturally maintain sequential order." },
      { code: "B", title: "It requires less memory overhead", description: "Hash Maps have higher overhead due to buckets and hash keys." },
      { code: "C", title: "Average O(1) lookups and insertions", description: "Direct index-like retrieval via hash functions rather than O(N) traversal." },
      { code: "D", title: "Bi-directional node traversal", description: "Double Linked Lists allow forwards and backwards travel." }
    ],
    correctAnswer: "C"
  },
  {
    questionId: 130,
    section: "technical",
    questionText: "When implementing a Breadth-First Search (BFS) algorithm to traverse a graph, which data structure is used to track vertices to visit next?",
    competencyTag: "Data Structures & Algorithms",
    options: [
      { code: "A", title: "Stack", description: "Used in Depth-First Search (DFS) traversal." },
      { code: "B", title: "Queue", description: "Used in BFS to process nodes in the order they are discovered (FIFO)." },
      { code: "C", title: "Priority Queue", description: "Used in Dijkstra's algorithm to visit nodes by weight." },
      { code: "D", title: "Hash Set", description: "Usually used to store the set of already visited nodes." }
    ],
    correctAnswer: "B"
  }
];
