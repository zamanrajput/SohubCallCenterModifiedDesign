interface PerformerType {
  id: string;
  imgsrc: string;
  name: string;
  post: string;
  pname: string;
  status: string;
  budget: string;
}

const TopPerformerData: PerformerType[] = [
  {
    id: "1",
    imgsrc: "/images/profile/user-1.jpg",
    name: "Sunil Joshi",
    post: "Night Shift",
    pname: "Level 1",
    status: "High",
    budget: "312K",
  },
  {
    id: "2",
    imgsrc: "/images/profile/user-2.jpg",
    name: "Asad Mirza",
    post: "Evening Shift",
    pname: "Level 3",
    status: "Low",
    budget: "50K",
  },
  {
    id: "3",
    imgsrc: "/images/profile/user-1.jpg",
    name: "Ali Kazmi",
    post: "Night Shift",
    pname: "Level 1",
    status: "High",
    budget: "390K",
  },
  {
    id: "4",
    imgsrc: "/images/profile/user-2.jpg",
    name: "Rashid Ali",
    post: "Night Shift",
    pname: "Level 3",
    status: "Low",
    budget: "40k",
  },
  
];

export default TopPerformerData;
