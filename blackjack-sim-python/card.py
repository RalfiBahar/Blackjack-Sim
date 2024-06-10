class Card:
    def __init__(self, suit, number):
        self.suit = suit
        self.number = number

    def __str__(self):
        return f"{self.number} of {self.suit}"

    def value(self):
        if self.number in ['Jack', 'Queen', 'King']:
            return 10
        elif self.number == 'Ace':
            return 11  # or 1, this possiblity will be calculated in game class
        else:
            return int(self.number)