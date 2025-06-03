export interface SurveyFormData {
  full_name: string;
  contact_number: string;
  date: Date | null;
  age: number | string;
  likes_pizza: boolean;
  likes_pasta: boolean;
  likes_papandwors: boolean;
  likes_chickenstirfry: boolean;
  rating_eatout: number;
  rating_watchmovies: number;
  rating_watchtv: number;
  rating_listenradio: number;
}

export interface SurveyStats {
  totalSurveys: number;
  averageAge: number;
  oldestPerson: number;
  youngestPerson: number;
  percentagePizzaLovers: number;
  averageEatOutRating: number;
}

export type RatingKey = 'rating_eatout' | 'rating_watchmovies' | 'rating_watchtv' | 'rating_listenradio';
export type FoodKey = 'likes_pizza' | 'likes_pasta' | 'likes_papandwors' | 'likes_chickenstirfry';