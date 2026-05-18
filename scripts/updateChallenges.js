import dotenv from 'dotenv';
import Lesson from '../api/models/Lesson.js';

dotenv.config({ path: ['.env.local', '.env'] });

const challenges = [
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Beaker_selection_01.jpg/800px-Beaker_selection_01.jpg',
    question: 'Dung cu dung de chua va dun nong dung dich nay ten la gi?',
    options: ['Coc thuy tinh', 'Ong dong', 'Binh tam giac', 'Ong nghiem'],
    correctAnswer: 0,
    targetType: 'dung cu'
  },
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Magnesium_ribbon_burning.jpg/800px-Magnesium_ribbon_burning.jpg',
    question: 'Hien tuong dai magie chay sang ruc ro nay la dau hieu cua gi?',
    options: ['Bien doi vat ly', 'Su bay hoi', 'Phan ung hoa hoc', 'Su hoa tan'],
    correctAnswer: 2,
    targetType: 'bien doi'
  },
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Amedeo_Avogadro2.jpg',
    question: 'Nha bac hoc de xuat hang so 6.022 x 10^23 la ai?',
    options: ['Lavoisier', 'Dalton', 'Avogadro', 'Mendeleev'],
    correctAnswer: 2,
    targetType: 'nha bac hoc'
  },
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Copper%28II%29_sulfate_solution.jpg/800px-Copper%28II%29_sulfate_solution.jpg',
    question: 'Chat long mau xanh lam dong nhat nay la vi du cua khai niem nao?',
    options: ['Nhu tuong', 'Huyen phu', 'Dung dich', 'Hon hop khong dong nhat'],
    correctAnswer: 2,
    targetType: 'trang thai chat'
  },
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Antoine_Lavoisier.jpg/800px-Antoine_Lavoisier.jpg',
    question: 'Cha de cua dinh luat bao toan khoi luong la ai?',
    options: ['Isaac Newton', 'Antoine Lavoisier', 'Marie Curie', 'Albert Einstein'],
    correctAnswer: 1,
    targetType: 'nha bac hoc'
  },
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/H2_Combustion_Reaction.png/800px-H2_Combustion_Reaction.png',
    question: 'So do nay mo ta dieu gi trong hoa hoc?',
    options: ['Ti khoi', 'Do tan', 'Phuong trinh hoa hoc', 'Cong thuc phan tu'],
    correctAnswer: 2,
    targetType: 'mo hinh'
  },
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Litmus_paper.JPG/800px-Litmus_paper.JPG',
    question: 'Dung cu dung de nhan biet nhanh tinh acid/base la gi?',
    options: ['Giay quy tim', 'Giay loc', 'Ong dong', 'Pheu'],
    correctAnswer: 0,
    targetType: 'dung cu thu'
  },
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Sodium_hydroxide_pellets.JPG/800px-Sodium_hydroxide_pellets.JPG',
    question: 'Nhung vien chat ran mau trang am uot nay thuong la vi du cua gi?',
    options: ['Acid', 'Base (kiem)', 'Oxit', 'Muoi'],
    correctAnswer: 1,
    targetType: 'loai chat'
  },
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Rust_on_iron.jpg/800px-Rust_on_iron.jpg',
    question: 'Lop gi mau nau do tren be mat sat la loai chat nao?',
    options: ['Oxit', 'Axit', 'Muoi', 'Bazo'],
    correctAnswer: 0,
    targetType: 'loai chat'
  },
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Halite_Crystal.jpg/800px-Halite_Crystal.jpg',
    question: 'Tinh the muoi an trong tu nhien co ten khoang hoc la gi?',
    options: ['Thach anh', 'Halite (muoi da)', 'Canxit', 'Pirit'],
    correctAnswer: 1,
    targetType: 'loai chat'
  },
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Potassium_carbonate_potash.jpg/800px-Potassium_carbonate_potash.jpg',
    question: 'Chat nay duoc dung rong rai trong san xuat phan bon. Day la gi?',
    options: ['Axit manh', 'Nhien lieu', 'Muoi kali (potash)', 'Oxit kim loai'],
    correctAnswer: 2,
    targetType: 'ung dung'
  },
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Methane-3D-balls.png/800px-Methane-3D-balls.png',
    question: 'Mo hinh nay mo ta khi methane CH4, thanh phan chinh cua loai nao?',
    options: ['Acid', 'Base', 'Nhien lieu khi', 'Oxit khi'],
    correctAnswer: 2,
    targetType: 'ung dung'
  }
];

async function updateChallenges() {
  try {
    const lessons = await Lesson.find({ classId: 8 });
    console.log(`Found ${lessons.length} grade 8 lessons.`);

    for (let i = 0; i < Math.min(lessons.length, challenges.length); i += 1) {
      const lesson = lessons[i];
      await Lesson.update(lesson.lessonId || lesson.id, {
        ...lesson,
        challenges: [challenges[i]]
      });
      console.log(`Updated challenge for: ${lesson.title}`);
    }

    console.log('Successfully updated challenges.');
    process.exit(0);
  } catch (error) {
    console.error('Error updating challenges:', error);
    process.exit(1);
  }
}

updateChallenges();
