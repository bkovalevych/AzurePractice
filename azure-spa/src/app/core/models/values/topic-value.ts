export class TopicValue {
  iconSrc: string;
  name: string;
}

export function getTopics() {
  let topics: TopicValue[] = [
    {
      iconSrc: "assets/images/topics/clothes.png",
      name: "clothes"
    },
    {
      iconSrc: "assets/images/topics/education.png",
      name: "education"
    },
    {
      iconSrc: "assets/images/topics/entertainment.png",
      name: "entertainment"
    },
    {
      iconSrc: "assets/images/topics/food.png",
      name: "food"
    },
    {
      iconSrc: "assets/images/topics/transport.png",
      name: "transport"
    },
  ]
  return topics;
}

