def percentage(str):
    try:
      number = int(str)
      assert (0 <= number <= 100) == True
      return str
    except:
        raise ValueError("Not a percentage")
    