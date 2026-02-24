import mongoose from 'mongoose'
import { EXPERIENCE_LEVELS } from '../config/constant'

// job role is set by admin 
const jobRoleSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },
        category: {
            type: String,
            required: true,
            enum: Object.values(JOB_CATEGORIES),
            index: true,
        },
        experienceLevel: {
            type: String,
            enum: Object.values(EXPERIENCE_LEVELS),
            index: true,
            required: true
        },
        description: {
            type: String,
            required: true,
            max: [1000, "Please make it below 500 characters"]
        },
        responsibilities: [String],
        requiredSkills: {

            critical: [{
                title: String,
                importance: {
                    type: Number,
                    min: 1,
                    max: 10,
                    default: 10
                },
                description: String
            }],
            important: [{
                title: String,
                importance: {
                    type: Number,
                    min: 1,
                    max: 10,
                    default: 7,
                },
                description: String
            }],
            niceToHave: [{
                title: String,
                importance: {
                    type: Number,
                    min: 1,
                    max: 10,
                    default: 5,
                },
                description: String
            }]
        },
        salaryRange: {
            type: Number,
            min: Number,
            max: Number,
            currency: {
                type: String,
                default: 'USD'
            },
            period: {
                type: String,
                enum: ['hourly', 'monthly', 'yearly'],
                default: 'yearly'
            },
        },
        demandLevel: {
            type: String,
            enum: ['low', 'medium', 'high', 'very-high'],
            default: 'medium',
        },
        growthRate: Number,
        jobOpenings: Number,
        relatedRoles: [{
            type: mongoose.Types.ObjectId,
            ref: 'jobRoleModel',
        }],
        commonCarrerPaths: [String],
        industryTrend: {
            type: Boolean,
            default: false,
            index: true,
        },
        views: {
            type: Number,
            default: 0
        }
    }, {
    timestamps: true,
    toObject:{virtuals:true},
    toJson:{virtuals:true},
}
)

jobRoleSchema.index({category:1,experienceLevel:1})
jobRoleSchema.index({trending:-1,views:-1})
jobRoleSchema.index({ title: 'text', description: 'text' });

// now making the slug
// u cannot use arrow fxn cause it dont have access to this but here this have access to current document
jobRoleSchema.pre('save', function (next) {
    // means abhi abhi banaya
    if (this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');
    }
    next();
});

// getting all required skills 
// // the use of this method is that requiresskill is store like this
// [
//     critical:[A,b]
//     important:[c],
//     niceToHave:[d]
//     //  to this
//     [
//     {a,critical}
//     {b,critical}
//     {c,iimp}
// ]
// ]
jobRoleSchema.methods.getAllRequiredSkill = function(){
    const skills=[]
    const critical = this.requiredSkills?.critical || {}
    const important = this.requiredSkills?.important|| {}
    const niceToHave = this.requiredSkills?.niceToHave || {}

    for(let s of critical){
        // woh item ko pehla aur dekh ki woh category critical hai kya
        skills.push({...s , category:'critical'})
    }
    for(let s of important){
        // woh item ko pehla aur dekh ki woh category critical hai kya
        skills.push({...s , category:'important'})
    }
    for(let s of niceToHave){
        // woh item ko pehla aur dekh ki woh category critical hai kya
        skills.push({...s , category:'niceToHave'})
    }

    return skills
    
}
// schema . methods works on single document
// statics works on whole model
jobRoleSchema.statics.findSimilarRoles = async function(category , limit =5, experienceLevel){
    return this.find({
        category,
        experienceLevel,
    }).limit(limit)
    .select('title slug description category , experienceLevel , salaryRange')
}

export const jobRoleModel = mongoose.model('jobRoleModel',jobRoleSchema)
    // 🔥 Imagine This Situation

// You have:

// 📦 1,000,000 job documents in MongoDB.

// Each document looks like:

// {
//   title: "Backend Developer",
//   category: "development",
//   experienceLevel: "junior"
// }

// ❌ Without Index (Very Important)

// Now you run:

// JobRole.find({ category: "development" })

//  MongoDB will:

// Check document 1

// Check document 2

// Check document 3

// ...

// Check document 1,000,000

// This is called:

// 👉 Full Collection Scan

// Time complexity ≈ O(n)

// Very slow when data grows.

// ✅ With Index

// When you write:

// category: { index: true }


// MongoDB creates a special data structure (B-tree).

// Internally it becomes like:

// Category Index

// data → [doc45, doc200]
// design → [doc3, doc50]
// development → [doc1, doc2, doc5, doc8]


// Now when you search:

// find({ category: "development" })


// MongoDB:

// 👉 Directly jumps to "development"
// 👉 Returns only those docs

// No scanning everything.

// Time complexity ≈ O(log n)

// Much faster.

// 🧠 Real-Life Analogy

// Imagine a dictionary.

// Without index:
// You read every page to find “zebra”.

// With index:
// You open Z section directly.

// That Z section is the index.

// 🔥 Now Let’s Understand Compound Index

// You saw this:

// jobRoleSchema.index({ category: 1, experienceLevel: 1 });


// This creates ONE combined index.

// Internally it becomes sorted like:

// (development, junior)
// (development, senior)
// (design, junior)
// (design, senior)


// Now if you run:

// JobRole.find({
//   category: "development",
//   experienceLevel: "junior"
// })


// MongoDB directly jumps to:

// (development, junior)


// Super fast.

// 🔥 Why Not Two Separate Indexes?

// If you only have:

// category index
// experienceLevel index


// MongoDB:

// Finds all development jobs

// Then filters junior manually

// Still some work.

// Compound index is faster for combined queries.

// 🔥 Order Matters (Very Important)

// If index is:

// { category: 1, experienceLevel: 1 }


// It supports:

// ✔ category
// ✔ category + experienceLevel

// But NOT efficiently:

// ❌ experienceLevel alone

// Order matters.

// 🔥 When Should You Use Index?

// Use index when:

// You search frequently by that field

// You filter frequently

// You sort frequently

// Data size is large

// ⚠️ Important: Index Has Cost

// Index:

// Uses extra memory

// Slows down insert/update slightly

// Because MongoDB must update index also.

// So don’t index everything blindly.