# journal-starter

I would like to create a static site generator, and I would also like to have a static site to keep my journal in, so I have created a Catch 22.

This repo is for small command-line utilities to maintain a journal while I build up to a more user-friendly tool.

## OK, but...

What? _Why_ do I want to create a static site generator when there are so many already? \*sigh\* ...

  * I don't like that most SSGs use Markdown files with YAML at the top as their primary data format. I feel like YAML is a structured data compromise when you need humans to touch the data structures, but you don't want it to be tedious. But _why_ do humans have to touch these files to begin with?
  * And that data folder is usually just a flat directory with a looot of Markdown files that follow some kind of `slug-as-the-title.md` naming convention. What if I don't care about the title of my posts? Or where they physically are? What I generate _a lot_ of posts in a day? How do I maintain this data in a way that doesn't suck?
  * I'm also interested in this question: can the site generator be designed in such a way that it needs to re-generate as few pages as possible? Inquiring minds want to know!

## Research

### Post IDs

Post IDs are 12-character strings composed of a timestamp concatenated with a random integer. The timestamp and and the random value are both expressed as a [Crockford base32](http://www.crockford.com/wrmg/base32.html) number. This encoding type was chosen because it strikes the right balance between compactness of representation and being human-readable and case-insensitive. The fact that it is case-insensitive is important because two of the most popular operating systems, Windows and OS X, use case-insensitive file systems.

The rate of change of each character in the timestamp is as follows:

```txt
    1st:    ~every 34 years           (34.841 years)
    2nd:    ~every year               (1.089 years)
    3rd:    ~every 12 days            (12.428 days)
    4th:    ~every 9 hours            (9.321 hours)
    5th:    ~every 17 minutes         (17.476 minutes)
    6th:    ~every 33 seconds         (32.768 seconds)
    7th:    ~every second             (1.024 seconds)
    8th:    every 32 milliseconds
    9th:    every millisecond
```

The timestamp portion of the post ID is expected to have 9 characters until the year 3058, so we shouldn't need to worry about problems arising because of variable post ID lengths.

### Directory Structure

The file-system itself is used to store all user-generated data. This will allow for maximum portability of the data itself, since we can use file-syncing tools like Dropbox to move the data across devices. We can still use databases for indexes and other functions, but those should be re-created per device and can be destroyed or lost without harming the primary data.

The data directory will be touched by automated tools most of the time. Hopefully a human will only need to touch this structure directly in case of some weird use-case or catastrophic error. With that in mind, we can arrange the data as follows:

```txt
    <root directory>
    ├── meta.json
    ├── posts
    │   ├── ...
    │   │
    │   ├── 1ba
    │   ├── 1ba
    │   │   ├── ...
    │   │   │
    │   │   ├── 8j
    │   │   │   ├── ...
    │   │   │   │
    │   │   │   ├── gr
    │   │   │   │   ├── 1ba8jgrhxvtm.json
    │   │   │   │   ├── 1ba8jgrhxvtm
    │   │   │   │   │   ├── photo1.jpg
    │   │   │   │   │   └── archive.zip
    │   │   │   │   └── 1ba8jgrj2kje.json
    │   │   │   └── ...
    │   │   └── ...
    │   │
    │   ├── 1bb
    │   └── ...
    │
    └── types
        ├── article.json
        ├── bookmark.json
        ├── note.json
        └── page.json
```

Every entry is a 'post'. Posts are generic envelopes that wrap our data with versioning information, permissions, and other metadata. The file name of each post file is the post's ID. The radix tree structure of posts is designed to avoid having more than 10,000 files in a particular directory. Most file systems have no technical limit on the number of files in a directory, but generally anything over this threshold will cause performance degradation.

There may also be a directory with the same name as a post's JSON file -- this is where attachments for that particular post are stored. The example stucture above shows that the post with ID `1ba8jgrhxvtm` also has the attachments `photo1.jpg` and `archive.zip`.

To have different kinds of posts, each post must denote its 'type'. Post types are saved in the `types` directory and describe the kind of information that is collected for each type. For example, `note` types may have location information, while `article` types must specify a title for the post.
