# Quip Operation Results

Quip mutation results report the quip UUID.

```json
{
  "ok": true,
  "type": "quips.cartyGreetingQuip.add",
  "ids": {
    "quipId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0202"
  },
  "changed": [
    {
      "kind": "quips.cartyGreetingQuip",
      "id": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0202",
      "action": "created"
    }
  ],
  "warnings": []
}
```

Quip reads return the selected index and quip.

```json
{
  "ok": true,
  "type": "quips.openingQuip.getByIndex",
  "ids": {
    "quipId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0201"
  },
  "changed": [],
  "data": {
    "index": 0,
    "quip": {
      "quipId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0201",
      "text": "The first rule of Cart Club is: You do not talk about Cart Club."
    }
  },
  "warnings": []
}
```
