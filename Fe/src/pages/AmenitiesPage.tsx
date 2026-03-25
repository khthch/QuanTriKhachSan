import React from 'react';
import { motion } from 'motion/react';
import { 
  Waves, 
  ConciergeBell, 
  Wine, 
  Utensils, 
  Coffee, 
  Dumbbell, 
  Sparkles, 
  Camera 
} from 'lucide-react';

export function AmenitiesPage() {
  const amenities = [
    {
      title: "Hồ bơi Vô cực",
      description: "Trải nghiệm cảm giác lơ lửng giữa bầu trời và mặt nước tại hồ bơi vô cực tầng thượng, nơi tầm nhìn hướng thẳng ra đường chân trời thành phố.",
      image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=1000",
      icon: Waves
    },
    {
      title: "Nhà hàng Fine Dining",
      description: "Hành trình ẩm thực tinh tế được dẫn dắt bởi các đầu bếp đạt sao Michelin, kết hợp nguyên liệu địa phương và kỹ thuật nấu nướng hiện đại.",
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1000",
      icon: Utensils
    },
    {
      title: "Spa & Trị liệu",
      description: "Tìm lại sự cân bằng trong tâm hồn và cơ thể với các liệu trình massage truyền thống và hiện đại trong không gian yên tĩnh tuyệt đối.",
      image: "https://images.unsplash.com/photo-1544161515-4af6b1d46152?auto=format&fit=crop&q=80&w=1000",
      icon: Sparkles
    },
    {
      title: "Trung tâm Thể hình",
      description: "Trang bị máy móc hiện đại nhất từ Technogym, cùng với các lớp yoga và pilates cá nhân hóa theo nhu cầu của bạn.",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1000",
      icon: Dumbbell
    }
  ];

  return (
    <div className="pb-32">
      {/* Hero */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden mb-24">
        <img 
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1920" 
          alt="Amenities Hero" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center text-white space-y-4">
          <h1 className="font-serif text-6xl tracking-tight">Tiện ích Đẳng cấp</h1>
          <p className="font-sans tracking-[0.3rem] uppercase text-sm opacity-80">Tận hưởng từng khoảnh khắc tinh túy</p>
        </div>
      </section>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 space-y-32">
        {amenities.map((item, index) => (
          <motion.div 
            key={item.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16`}
          >
            <div className="flex-1 space-y-8">
              <div className="inline-flex p-4 bg-secondary/10 rounded-full">
                <item.icon className="w-8 h-8 text-secondary" />
              </div>
              <h2 className="font-serif text-4xl text-slate-900">{item.title}</h2>
              <p className="text-slate-500 leading-relaxed text-lg font-light">
                {item.description}
              </p>
              <button className="text-secondary font-bold tracking-widest uppercase text-xs border-b border-secondary pb-1 hover:opacity-70 transition-opacity">
                Khám phá thêm
              </button>
            </div>
            <div className="flex-1 relative aspect-[4/3] overflow-hidden rounded-sm shadow-2xl">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Additional Services */}
      <section className="mt-40 bg-slate-900 py-32 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-16">
          <div className="space-y-4">
            <h2 className="font-serif text-4xl">Dịch vụ Đặc quyền</h2>
            <p className="text-white/40 tracking-widest uppercase text-xs">Luôn sẵn sàng phục vụ bạn 24/7</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { icon: ConciergeBell, label: "Quản gia riêng" },
              { icon: Wine, label: "Hầm rượu quý" },
              { icon: Coffee, label: "Afternoon Tea" },
              { icon: Camera, label: "Private Tours" }
            ].map((service) => (
              <div key={service.label} className="space-y-4 group cursor-pointer">
                <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center group-hover:bg-secondary transition-colors">
                  <service.icon className="w-6 h-6" />
                </div>
                <p className="font-serif text-lg">{service.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
