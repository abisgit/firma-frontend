"use client";

import { useEffect, useState } from 'react';
import {
    Users,
    GraduationCap,
    BookOpen,
    Calendar,
    TrendingUp,
    AlertCircle
} from 'lucide-react';
import { getStudents, getTeachers, getClasses } from '@/lib/api';

export default function SchoolDashboard() {
    const [stats, setStats] = useState({
        students: 0,
        teachers: 0,
        classes: 0,
        attendanceRate: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [students, teachers, classes] = await Promise.all([
                    getStudents(),
                    getTeachers(),
                    getClasses()
                ]);

                setStats({
                    students: students.length,
                    teachers: teachers.length,
                    classes: classes.length,
                    attendanceRate: 96.5 // Calculated from real data later
                });
            } catch (error) {
                console.error('Failed to fetch school stats', error);
            }
        };

        fetchStats();
    }, []);


    const cards = [
        {
            title: "Total Students",
            value: stats.students.toString(),
            description: "+12% from last term",
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-100",
            href: "/school/students"
        },
        {
            title: "Total Teachers",
            value: stats.teachers.toString(),
            description: "Full-time staff",
            icon: GraduationCap,
            color: "text-purple-600",
            bg: "bg-purple-100",
            href: "/school/teachers"
        },
        {
            title: "Active Classes",
            value: stats.classes.toString(),
            description: "Across all grades",
            icon: BookOpen,
            color: "text-green-600",
            bg: "bg-green-100",
            href: "/school/classes"
        },
        {
            title: "Attendance Rate",
            value: `${stats.attendanceRate}%`,
            description: "Average this week",
            icon: TrendingUp,
            color: "text-orange-600",
            bg: "bg-orange-100",
            href: "/school/attendance"
        }
    ];

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {cards.map((card, index) => (
                    <a key={index} href={card.href} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer block">
                        <div className="flex flex-row items-center justify-between pb-2">
                            <h3 className="text-sm font-medium text-muted-foreground">
                                {card.title}
                            </h3>
                            <div className={`p-2 rounded-full ${card.bg}`}>
                                <card.icon className={`h-4 w-4 ${card.color}`} />
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{card.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {card.description}
                            </p>
                        </div>
                    </a>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 bg-white rounded-xl shadow-sm border p-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold">Overview</h3>
                        <p className="text-sm text-muted-foreground">
                            School performance overview for the current academic year 2025-2026.
                        </p>
                    </div>
                    <div className="pl-2">
                        <div className="h-[200px] flex items-center justify-center border rounded-md m-4 bg-slate-50 text-slate-400">
                            Chart Placeholder (Attendance Over Time)
                        </div>
                    </div>
                </div>

                <div className="col-span-3 bg-white rounded-xl shadow-sm border p-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold">Upcoming Events</h3>
                        <p className="text-sm text-muted-foreground">
                            Recent and upcoming activities
                        </p>
                    </div>
                    <div>
                        <div className="space-y-4">
                            {[
                                { title: "Teachers Meeting", time: "Today, 2:00 PM", type: "meeting" },
                                { title: "Grade 8 Math Exam", time: "Tomorrow, 9:00 AM", type: "exam" },
                                { title: "Parent-Teacher Conference", time: "Fri, 4:00 PM", type: "event" },
                            ].map((event, i) => (
                                <div key={i} className="flex items-center">
                                    <div className="mr-4 rounded-full bg-slate-100 p-2">
                                        <Calendar className="h-4 w-4 text-slate-500" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">{event.title}</p>
                                        <p className="text-xs text-muted-foreground">{event.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
