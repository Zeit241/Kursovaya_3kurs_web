import Image from "next/image"
import { Calendar } from "lucide-react"

export function TreatmentSection() {
  return (
    <section className="py-20 lg:py-28 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left - Mobile App Mockup */}
          <div className="relative flex justify-center">
            <div className="relative w-72 sm:w-80">
              {/* Phone Frame */}
              <div className="bg-foreground rounded-[2.5rem] p-3 shadow-2xl">
                <div className="bg-card rounded-[2rem] overflow-hidden">
                  {/* App Header */}
                  <div className="p-5 pb-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-xs text-muted-foreground">Today</p>
                        <h4 className="text-sm font-bold text-foreground">Schedule</h4>
                      </div>
                      <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-accent-foreground" />
                      </div>
                    </div>

                    {/* Calendar Row */}
                    <div className="flex items-center gap-1.5 mb-6">
                      {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day, i) => (
                        <div
                          key={day}
                          className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl ${
                            i === 3 ? "bg-accent text-accent-foreground" : ""
                          }`}
                        >
                          <span className={`text-[10px] ${i === 3 ? "text-accent-foreground/80" : "text-muted-foreground"}`}>{day}</span>
                          <span className={`text-xs font-bold ${i === 3 ? "text-accent-foreground" : "text-foreground"}`}>{14 + i}</span>
                        </div>
                      ))}
                    </div>

                    <h5 className="text-xs font-bold text-foreground mb-3">Schedule Today</h5>

                    {/* Schedule Items */}
                    <div className="flex flex-col gap-2.5">
                      {[
                        { color: "bg-accent", name: "Cardiologist", time: "09:00 - 10:00" },
                        { color: "bg-emerald-500", name: "Dermatologist", time: "11:00 - 12:00" },
                      ].map((item) => (
                        <div key={item.name} className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                          <div className={`w-2.5 h-2.5 ${item.color} rounded-full`} />
                          <div>
                            <p className="text-xs font-semibold text-foreground">{item.name}</p>
                            <p className="text-[10px] text-muted-foreground">{item.time}</p>
                          </div>
                        </div>
                      ))}
                      <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                        <div className="w-6 h-6 rounded-full overflow-hidden">
                          <Image src="/images/doctor-sophia.jpg" alt="Dr. Charlotte" width={24} height={24} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">Dr. Charlotte Baker</p>
                          <p className="text-[10px] text-muted-foreground">Pediatrics</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Arrow */}
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-foreground rounded-full flex items-center justify-center shadow-xl">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-foreground leading-tight text-balance">
              Treatment is Easy with Medifye
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed max-w-md">
              Schedule appointments, track your treatment plans, and stay connected with your care team -- all from the palm of your hand.
            </p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex -space-x-2.5">
                {["sophia", "jana", "mike"].map((name) => (
                  <div key={name} className="w-11 h-11 rounded-full overflow-hidden border-2 border-card shadow-sm">
                    <Image src={`/images/doctor-${name}.jpg`} alt="Team member" width={44} height={44} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <span className="text-sm font-semibold text-foreground">+50 Specialists</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
