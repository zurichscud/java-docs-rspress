export interface TreeNode {
  name: string
  type: 'file' | 'directory'
  children: TreeNode[]
  extension?: string
  comment?: string
}

export interface ParsedTree {
  nodes: TreeNode[]
  raw: string
}

/**
 * Parse tree-style directory structure text into TreeNode array
 *
 * Supported formats:
 * doc_build
 * ├── file.ts
 * └── folder
 *     ├── nested.ts
 *     └── another.ts
 */
export function parseTreeContent(content: string): ParsedTree {
  let lines = content.split('\n').filter((line) => line.trim())

  // Skip leading "." line (current directory marker)
  if (lines.length > 0 && lines[0].trim() === '.') {
    lines = lines.slice(1)
  }

  // Detect the indentation mode (2-space or 4-space) for the entire content
  const indentSize = detectIndentSize(lines)

  const nodes: TreeNode[] = []
  const stack: { node: TreeNode; indent: number }[] = []

  for (const line of lines) {
    const indent = calculateIndent(line, indentSize)
    const fullName = extractName(line)

    // Extract name and comment
    const { name, comment } = extractNameAndComment(fullName)

    if (!name) continue

    const isDirectory = isDirectoryName(name)

    const node: TreeNode = {
      name: name.replace(/\/$/, ''),
      type: isDirectory ? 'directory' : 'file',
      children: [],
      extension: isDirectory ? undefined : getExtension(name),
      comment,
    }

    // Find parent node by popping items with equal or greater indent
    while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
      stack.pop()
    }

    if (stack.length === 0) {
      nodes.push(node)
    } else {
      stack[stack.length - 1].node.children.push(node)
    }

    // Only directories can have children
    if (node.type === 'directory') {
      stack.push({ node, indent })
    }
  }

  return { nodes, raw: content }
}

/**
 * Detect the indentation size used in the content
 */
function detectIndentSize(lines: string[]): number {
  for (const line of lines) {
    const match = line.match(/^( +)[├└]/)
    if (match) {
      const spaceCount = match[1].length
      if (spaceCount === 2) {
        return 2
      }
    }

    if (/│ [├└]/.test(line)) {
      return 2
    }
  }

  return 4
}

/**
 * Calculate indent level from line
 */
function calculateIndent(line: string, indentSize: number): number {
  let indent = 0
  let i = 0

  while (i < line.length) {
    const char = line[i]

    if (indentSize === 4 && char === '│' && line.substring(i, i + 4) === '│   ') {
      indent++
      i += 4
      continue
    }

    if (indentSize === 2 && char === '│' && line[i + 1] === ' ') {
      indent++
      i += 2
      continue
    }

    if (char === ' ') {
      if (indentSize === 2 && line.substring(i, i + 2) === '  ') {
        indent++
        i += 2
        continue
      }
      if (indentSize === 4 && line.substring(i, i + 4) === '    ') {
        indent++
        i += 4
        continue
      }
    }

    if (char === '├' || char === '└') {
      if (
        line.substring(i, i + 3) === '├──' ||
        line.substring(i, i + 3) === '└──'
      ) {
        indent++
      }
      break
    }

    break
  }

  return indent
}

/**
 * Extract file/folder name from line
 */
function extractName(line: string): string {
  return line
    .replace(/^[\s│]*/g, '')
    .replace(/^[├└]──\s*/, '')
    .trim()
}

/**
 * Extract filename/dirname and comment from a line
 */
function extractNameAndComment(fullName: string): {
  name: string
  comment: string | undefined
} {
  const trimmed = fullName.trim()
  if (!trimmed) {
    return { name: '', comment: undefined }
  }

  if (/^\.{2,}$/.test(trimmed)) {
    return { name: trimmed, comment: undefined }
  }

  const doubleSpaceMatch = trimmed.match(/^(.+?)\s{2,}(.+)$/)
  if (doubleSpaceMatch) {
    const potentialName = doubleSpaceMatch[1].trim()
    const potentialComment = doubleSpaceMatch[2].trim()

    if (isValidName(potentialName)) {
      return { name: potentialName, comment: potentialComment }
    }
  }

  const singleSpaceMatch = trimmed.match(
    /^(.+?\.[a-zA-Z0-9]+)\s+([^.].*)$/
  )
  if (singleSpaceMatch) {
    const potentialName = singleSpaceMatch[1].trim()
    const potentialComment = singleSpaceMatch[2].trim()
    return { name: potentialName, comment: potentialComment }
  }

  const hiddenFileMatch = trimmed.match(/^(\.[^\s]+)\s+(.+)$/)
  if (hiddenFileMatch) {
    return {
      name: hiddenFileMatch[1].trim(),
      comment: hiddenFileMatch[2].trim(),
    }
  }

  const dirCommentMatch = trimmed.match(/^([\w][\w.\s-]*?)\s+([^a-zA-Z0-9].*)$/)
  if (dirCommentMatch) {
    const potentialName = dirCommentMatch[1].trim()
    if (!/\.[a-zA-Z0-9]+$/.test(potentialName)) {
      return {
        name: potentialName,
        comment: dirCommentMatch[2].trim(),
      }
    }
  }

  return { name: trimmed, comment: undefined }
}

/**
 * Check if a string looks like a valid file/directory name
 */
function isValidName(name: string): boolean {
  if (!name) return false
  if (name.endsWith('/')) return true
  if (/\.[a-zA-Z0-9]+$/.test(name)) return true
  if (name.startsWith('.')) return true
  if (/^[\w\s.-]+$/.test(name)) return true
  return false
}

/**
 * Check if name represents a directory
 */
function isDirectoryName(name: string): boolean {
  if (name.endsWith('/')) return true

  const lastPart = name.split('/').pop() || name

  if (/^\.{2,}$/.test(lastPart)) {
    return false
  }

  if (lastPart.startsWith('.')) {
    return false
  }

  if (/\.[a-zA-Z0-9_-]+$/.test(lastPart)) {
    return false
  }

  return true
}

/**
 * Get file extension from name
 */
function getExtension(name: string): string {
  const match = name.match(/\.([^.]+)$/)
  return match ? match[1] : ''
}
