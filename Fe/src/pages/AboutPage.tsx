import React from 'react';
import { motion } from 'motion/react';
import { 
  History, 
  Heart, 
  Users, 
  Globe, 
  Award, 
  Compass 
} from 'lucide-react';

export function AboutPage() {
  return (
    <div className="pb-32">
      {/* Hero */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden mb-24">
        <img 
          src="https://images.unsplash.com/photo-1551882547-ff43c63e1c04?auto=format&fit=crop&q=80&w=1920" 
          alt="About Hero" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center text-white space-y-4">
          <h1 className="font-serif text-6xl tracking-tight">Câu chuyện của Chúng tôi</h1>
          <p className="font-sans tracking-[0.3rem] uppercase text-sm opacity-80">Nơi Nghệ thuật và Lòng hiếu khách giao thoa</p>
        </div>
      </section>

      {/* Philosophy */}
      <div className="max-w-4xl mx-auto px-6 text-center space-y-12 mb-32">
        <div className="inline-block p-4 bg-secondary/10 rounded-full">
          <Heart className="w-8 h-8 text-secondary" />
        </div>
        <h2 className="font-serif text-4xl text-slate-900">Triết lý của The Atelier</h2>
        <p className="text-slate-500 leading-relaxed text-xl font-light italic">
          "Chúng tôi không chỉ cung cấp một nơi để ngủ, chúng tôi kiến tạo một thánh đường cho tâm hồn. Tại The Atelier, mỗi chi tiết nhỏ nhất đều được chăm chút để kể một câu chuyện về sự tinh tế và lòng hiếu khách chân thành."
        </p>
        <div className="w-24 h-px bg-secondary mx-auto"></div>
      </div>

      {/* History & Vision */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-24 items-center mb-40">
        <div className="space-y-8">
          <div className="flex items-center gap-4 text-secondary">
            <History className="w-6 h-6" />
            <span className="text-xs font-bold tracking-widest uppercase">Di sản từ năm 1924</span>
          </div>
          <h2 className="font-serif text-4xl text-slate-900">Hành trình Một Thế kỷ</h2>
          <p className="text-slate-500 leading-relaxed font-light">
            Bắt đầu từ một biệt thự cổ điển tại trung tâm thành phố, The Atelier đã trải qua hơn 100 năm phát triển để trở thành biểu tượng của sự sang trọng và đẳng cấp. Chúng tôi tự hào giữ gìn những giá trị truyền thống trong khi không ngừng đổi mới để mang lại trải nghiệm hiện đại nhất cho khách hàng.
          </p>
          <div className="grid grid-cols-2 gap-8 pt-8">
            <div className="space-y-2">
              <h3 className="text-3xl font-serif text-secondary">15+</h3>
              <p className="text-xs font-bold tracking-widest uppercase text-slate-400">Giải thưởng Quốc tế</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-serif text-secondary">500k+</h3>
              <p className="text-xs font-bold tracking-widest uppercase text-slate-400">Khách hàng Hài lòng</p>
            </div>
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1000" 
            alt="History Image" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Values */}
      <section className="bg-slate-50 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-20">
            <h2 className="font-serif text-4xl">Giá trị Cốt lõi</h2>
            <p className="text-slate-400 tracking-widest uppercase text-xs">Những điều làm nên sự khác biệt</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { icon: Award, title: "Chất lượng Tuyệt đối", desc: "Không có sự thỏa hiệp trong chất lượng dịch vụ và tiện nghi." },
              { icon: Users, title: "Cá nhân hóa", desc: "Mỗi vị khách là một cá thể duy nhất với những nhu cầu riêng biệt." },
              { icon: Globe, title: "Bền vững", desc: "Cam kết bảo vệ môi trường và phát triển cộng đồng địa phương." }
            ].map((value) => (
              <div key={value.title} className="text-center space-y-6">
                <div className="w-16 h-16 mx-auto bg-white shadow-xl rounded-2xl flex items-center justify-center text-secondary">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl">{value.title}</h3>
                <p className="text-slate-500 font-light leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <div className="max-w-7xl mx-auto px-6 mt-40 text-center space-y-16">
        <div className="space-y-4">
          <h2 className="font-serif text-4xl">Đội ngũ Lãnh đạo</h2>
          <p className="text-slate-400 tracking-widest uppercase text-xs">Những người dẫn dắt tầm nhìn</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { name: "Julianna Smith", role: "CEO & Founder", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600" },
            { name: "Marcus Vane", role: "Creative Director", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600" },
            { name: "Elena Rossi", role: "Head of Hospitality", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600" }
          ].map((person) => (
            <div key={person.name} className="space-y-6 group">
              <div className="aspect-[3/4] overflow-hidden rounded-sm grayscale hover:grayscale-0 transition-all duration-500 shadow-lg">
                <img src={person.img} alt={person.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-serif text-2xl">{person.name}</h3>
                <p className="text-xs font-bold tracking-widest uppercase text-secondary mt-1">{person.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
