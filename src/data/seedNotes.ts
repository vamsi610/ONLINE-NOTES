import { INote } from '../types/note.ts';

export const INITIAL_SEED_NOTES: INote[] = [
  {
    _id: 'note_seed_1',
    title: 'Java OOP Principles: Polymorphism and Interfaces',
    category: 'Java',
    tags: ['OOP', 'Inheritance', 'Interfaces', 'Polymorphism'],
    isPinned: true,
    color: 'orange',
    createdAt: '2026-11-08T09:30:00.000Z',
    updatedAt: '2026-11-10T14:15:00.000Z',
    description: `### Key Principles of Object-Oriented Programming in Java

1. **Encapsulation**: Wrapping data (variables) and code acting on data (methods) together as a single unit. Use \`private\` modifiers and getters/setters.
2. **Abstraction**: Hiding implementation details and showing only functionality to the user using \`abstract class\` and \`interface\`.
3. **Inheritance**: Mechanism where one object acquires all properties and behaviors of a parent object (\`extends\` keyword).
4. **Polymorphism**: Ability of a message to be displayed in more than one form:
   - **Compile-time**: Method Overloading (same name, distinct signatures).
   - **Runtime**: Method Overriding (subclass provides specific implementation of parent method with \`@Override\`).

\`\`\`java
public interface Printable {
    void printDetails();
}

public class Student implements Printable {
    private String name;
    private int rollNo;

    public Student(String name, int rollNo) {
        this.name = name;
        this.rollNo = rollNo;
    }

    @Override
    public void printDetails() {
        System.out.println("Student: " + name + " [Roll: " + rollNo + "]");
    }
}
\`\`\`

*Note for exam: Java does NOT support multiple inheritance through classes, but achieves it via interfaces.*`,
  },
  {
    _id: 'note_seed_2',
    title: 'Python List Comprehensions & Generator Expressions',
    category: 'Python',
    tags: ['Pythonic', 'Generators', 'Memory-Optimization', 'Data-Structures'],
    isPinned: true,
    color: 'emerald',
    createdAt: '2026-11-07T11:00:00.000Z',
    updatedAt: '2026-11-09T18:40:00.000Z',
    description: `### Efficient Python Loops: Comprehensions vs Generators

#### 1. List Comprehensions
Syntactic sugar for building lists concisely:
\`\`\`python
# Format: [expression for item in iterable if condition]
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
evens_squared = [x**2 for x in numbers if x % 2 == 0]
# Result: [4, 16, 36, 64, 100]
\`\`\`

#### 2. Generator Expressions
Generators evaluate items lazily on-the-fly rather than allocating the entire list into RAM:
\`\`\`python
# Notice parenthesis instead of square brackets
gen = (x**2 for x in range(1_000_000))
print(next(gen))  # 0
print(next(gen))  # 1

# Memory usage comparison:
import sys
list_mem = sys.getsizeof([x for x in range(10000)]) # ~85,176 bytes
gen_mem = sys.getsizeof((x for x in range(10000)))   # ~208 bytes!
\`\`\`

*Key takeaway: For large streams of data (e.g. reading millions of lines from a CSV), always prefer generators over in-memory lists.*`,
  },
  {
    _id: 'note_seed_3',
    title: 'DBMS: Normalization Forms (1NF, 2NF, 3NF & BCNF)',
    category: 'DBMS',
    tags: ['Databases', 'SQL', 'Normalization', 'Relational-Schema'],
    isPinned: false,
    color: 'blue',
    createdAt: '2026-11-05T15:20:00.000Z',
    updatedAt: '2026-11-09T10:10:00.000Z',
    description: `### Database Normalization Summary

Normalization organizes table columns to reduce data redundancy and prevent insertion, deletion, and update anomalies.

#### First Normal Form (1NF)
- Each column must contain atomic (indivisible) values.
- No repeating groups or arrays stored in a single field.
- A primary key uniquely identifies each record.

#### Second Normal Form (2NF)
- Must be in **1NF**.
- No **partial functional dependency**: every non-prime attribute must depend on the whole candidate key (not a subset of a composite key).

#### Third Normal Form (3NF)
- Must be in **2NF**.
- No **transitive dependency**: $X \\rightarrow Y$ and $Y \\rightarrow Z$ implies $X \\rightarrow Z$. If non-key attribute depends on another non-key attribute, split them into separate tables.

#### Boyce-Codd Normal Form (BCNF)
- Stricter version of 3NF.
- For every non-trivial functional dependency $X \\rightarrow Y$, $X$ must be a super key.

\`\`\`sql
-- Example 3NF Table Split
-- Instead of keeping Student(StudentID, Name, DeptID, DeptName, DeptBuilding)
CREATE TABLE Departments (
    DeptID VARCHAR(10) PRIMARY KEY,
    DeptName VARCHAR(50),
    DeptBuilding VARCHAR(50)
);

CREATE TABLE Students (
    StudentID INT PRIMARY KEY,
    Name VARCHAR(100),
    DeptID VARCHAR(10) REFERENCES Departments(DeptID)
);
\`\`\``,
  },
  {
    _id: 'note_seed_4',
    title: 'Mathematics: Eigenvalues, Eigenvectors & Matrix Diagonalization',
    category: 'Mathematics',
    tags: ['Linear-Algebra', 'Matrices', 'Machine-Learning', 'Vectors'],
    isPinned: false,
    color: 'violet',
    createdAt: '2026-11-04T08:15:00.000Z',
    updatedAt: '2026-11-08T16:20:00.000Z',
    description: `### Linear Algebra: Eigenvalues and Eigenvectors

#### Fundamental Definition
Given an $n \\times n$ square matrix $A$, a non-zero vector $v$ is an **eigenvector** with corresponding scalar **eigenvalue** $\\lambda$ if:

$$A v = \\lambda v$$

This means matrix multiplication on $v$ only scales its magnitude without changing its spatial direction!

#### Step-by-Step Method to Solve:
1. **Characteristic Equation**:
   $$\\det(A - \\lambda I) = 0$$
2. Solve the polynomial roots for $\\lambda$ (the eigenvalues).
3. For each eigenvalue $\\lambda_i$, solve the linear system:
   $$(A - \\lambda_i I) v = 0$$
   to determine the corresponding eigenspace basis vectors.

#### Applications in Computing:
- **Principal Component Analysis (PCA)**: Finding orthogonal directions of maximum variance in high-dimensional datasets.
- **Google PageRank**: Calculating the principal eigenvector of the web hyperlink transition matrix.
- **Image Compression & SVD**: Singular Value Decomposition relies on symmetric eigenvalue properties.`,
  },
  {
    _id: 'note_seed_5',
    title: 'DBMS: ACID Properties and Transaction Isolation Levels',
    category: 'DBMS',
    tags: ['Transactions', 'Concurrency', 'ACID', 'Locks'],
    isPinned: false,
    color: 'blue',
    createdAt: '2026-11-03T14:00:00.000Z',
    updatedAt: '2026-11-07T12:00:00.000Z',
    description: `### ACID Properties in Relational Databases

- **A - Atomicity**: "All or nothing". Either the entire transaction completes or none of its modifications persist.
- **C - Consistency**: Database transitions strictly from one valid state satisfying all schema constraints, foreign keys, and rules to another.
- **I - Isolation**: Concurrent execution of transactions yields the same system state as if transactions ran serially.
- **D - Durability**: Once committed, transaction results survive power failures, crashes, or reboots.

#### SQL Standard Isolation Levels:
1. **Read Uncommitted**: Fastest, but suffers from Dirty Reads.
2. **Read Committed**: Solves dirty reads; default in PostgreSQL/Oracle.
3. **Repeatable Read**: Guarantees reading the same row gives identical values throughout transaction; default in MySQL InnoDB.
4. **Serializable**: Highest protection level; prevents Phantom Reads via strict two-phase locking or multi-version concurrency control (MVCC).`,
  },
  {
    _id: 'note_seed_6',
    title: 'Python: Asyncio, Coroutines and Event Loops',
    category: 'Python',
    tags: ['Async', 'Concurrency', 'Asyncio', 'WebSockets'],
    isPinned: false,
    color: 'emerald',
    createdAt: '2026-11-02T10:45:00.000Z',
    updatedAt: '2026-11-06T15:30:00.000Z',
    description: `### Asynchronous Programming in Modern Python

Using \`async\` and \`await\` allows single-threaded concurrent I/O without the heavy overhead of multi-threading or multiprocessing.

\`\`\`python
import asyncio
import aiohttp

async def fetch_student_data(student_id):
    print(f"Fetching record {student_id}...")
    await asyncio.sleep(1) # Simulates network request
    return {"id": student_id, "status": "Enrolled"}

async def main():
    # Run multiple coroutines concurrently with gather
    tasks = [fetch_student_data(i) for i in range(1, 5)]
    results = await asyncio.gather(*tasks)
    print("All records fetched:", results)

# Run with event loop
asyncio.run(main())
\`\`\`

*Remember: Use \`asyncio\` for I/O-bound tasks (network, disk, DB queries). For CPU-bound tasks (crypto, video encoding, large matrix math), use \`multiprocessing\` to bypass the Python GIL.*`,
  },
];
