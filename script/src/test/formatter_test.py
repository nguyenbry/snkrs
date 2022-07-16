import unittest
from formatter import status, InvalidItemStatus


class formatter_test(unittest.TestCase):
    def test_yes(self):
        self.assertFalse(False)

    def test_sold_all_good(self):
        statuses = [" pending ", "pending", " Pending ",
                    "   ^ pending", " 389nPenDing eef", "sold "]
        expected = ["pending", "pending", "pending", "pending", "pending", ]

        statuses = [status({"status": i}) for i in statuses]

        for formatted_status, e in zip(statuses, expected):
            self.assertEqual(formatted_status, e)

    def test_active(self):
        statuses = [" active ", "AcTiveee", "ac activeiie ",
                    "Active", " Active eef", "aCtIvE "]
        expected = ["active", "active", "active", "active", "active"]

        statuses = [status({"status": i}) for i in statuses]

        for formatted_status, e in zip(statuses, expected):
            self.assertEqual(formatted_status, e)

    def test_paid(self):
        statuses = [" actpaidive ", "paid", "ac PaidPendin ",
                    "Paid", " p p p PAid", "p p jdw PAII paid*&*^% "]
        expected = ["paid", "paid", "paid", "paid", "paid"]

        statuses = [status({"status": i}) for i in statuses]

        for formatted_status, e in zip(statuses, expected):
            self.assertEqual(formatted_status, e)

    def test_payout(self):
        statuses = [" pay ", "PAy", "ac PYAoPayout ",
                    "Paid", " p p p payout", "pending payout "]
        expected = ["paid", "paid", "paid", "paid", "paid"]

        statuses = [status({"status": i}) for i in statuses]

        for formatted_status, e in zip(statuses, expected):
            self.assertEqual(formatted_status, e)

    def test_raises(self):
        for s in [" pa ", "act", "sol ",
                  "paiid", " p p p p", "pen"]:
            self.assertRaises(InvalidItemStatus, status, {"status": s})


if __name__ == "__main__":
    unittest.main()
